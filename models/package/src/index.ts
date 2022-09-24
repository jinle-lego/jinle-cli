import { isObject, readJsonFile } from '@jinle-cli/utils';
import { sync as pkgDirSync } from 'pkg-dir';
import path from 'path';
import formatPath from '@jinle-cli/format-path';
import npminstall from 'npminstall';
import { DEFAULT_REGISTRY, getLatestVersion } from '@jinle-cli/get-npm-info';
import { sync as pathExistsSync } from 'path-exists';
import fse from 'fs-extra';

import { PackageOptions } from './types';

class Package {
    private targetPath: string; // package路径

    private storeDir: string; // package缓存路径

    private packageName: string;

    private packageVersion: string;

    // 缓存node_modules中包名路径前缀
    // 包名如 _@jinle-cli_init@0.1.6@@jinle-cli/init
    // cacheFilePathPrefix = @jinle-cli_init
    private cacheFilePathPrefix: string;

    constructor(options: PackageOptions) {
        if (!options || !isObject(options)) {
            throw new Error('Package类传参有误！');
        }
        this.targetPath = options.targetPath;
        this.storeDir = options.storeDir;
        this.packageName = options.packageName;
        this.packageVersion = options.packageVersion;
        this.cacheFilePathPrefix = this.packageName.replace('/', '_');
    }

    // 缓存node_modules中包路径
    private get cacheFilePath(): string {
        return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`);
    }

    private async prepare() {
        if (this.storeDir && !pathExistsSync(this.storeDir)) {
            // 缓存路径不存在 创建缓存路径（包括所有不存在父路径）
            fse.mkdirpSync(this.storeDir);
        }
        if (this.packageVersion === 'latest') {
            this.packageVersion = await getLatestVersion(this.packageName);
        }
    }

    // 获取缓存node_modules中特定版本的包路径
    private getSpecificCacheFilePath(version: string): string {
        return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${version}@${this.packageName}`);
    }

    /**
     * 判断当前package是否存在
     */
    public async exists(): Promise<boolean> {
        if (this.storeDir) {
            // 缓存模式
            await this.prepare();
            return pathExistsSync(this.cacheFilePath);
        }
        return pathExistsSync(this.targetPath);
    }

    /**
     * 安装
     */
    public async install() {
        await this.prepare();
        return npminstall({
            root: this.targetPath,
            storeDir: this.storeDir,
            registry: DEFAULT_REGISTRY,
            pkgs: [{
                name: this.packageName,
                version: this.packageVersion,
            }],
        });
    }

    /**
     * 更新
     * 1. 获取最新的npm模块版本号
     * 2. 查询最新版本号对应路径是否存在
     * 3. 如果不存在，则直接安装最新版本
     */
    public async update() {
        await this.prepare();
        const latestVersion: string = await getLatestVersion(this.packageName);
        const latestCacheFilePath: string = this.getSpecificCacheFilePath(latestVersion);
        if (!pathExistsSync(latestCacheFilePath)) {
            await npminstall({
                root: this.targetPath,
                storeDir: this.storeDir,
                registry: DEFAULT_REGISTRY,
                pkgs: [{
                    name: this.packageName,
                    version: latestVersion,
                }],
            });
        }
        this.packageVersion = latestVersion;
    }

    /**
     * 获取入口文件路径
     * 1. 获取package.json所在目录
     * 2. 读取package.json
     * 3. 寻找main/lib
     * 4. 不同系统路径兼容
     */
    public getRootFilePath(): string {
        const pkgDir: string = pkgDirSync(this.targetPath);
        if (pkgDir) {
            const pkgFile = readJsonFile(path.resolve(pkgDir, 'package.json'));
            if (pkgFile && pkgFile.main) {
                return formatPath(path.resolve(pkgDir, pkgFile.main));
            }
        }
        return null;
    }
}

export default Package;
