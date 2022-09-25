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
    private _targetPath: string; // package路径

    private _storeDir: string; // package缓存路径

    private _packageName: string;

    private _packageVersion: string;

    // 缓存node_modules中包名路径前缀
    // 包名如 _@jinle-cli_init@0.1.6@@jinle-cli/init
    // cacheFilePathPrefix = @jinle-cli_init
    private _cacheFilePathPrefix: string;

    constructor(options: PackageOptions) {
        if (!options || !isObject(options)) {
            throw new Error('Package类传参有误！');
        }
        this._targetPath = options.targetPath;
        this._storeDir = options.storeDir;
        this._packageName = options.packageName;
        this._packageVersion = options.packageVersion;
        this._cacheFilePathPrefix = this._packageName.replace('/', '_');
    }

    // 缓存node_modules中包路径
    private get _cacheFilePath(): string {
        return path.resolve(this._storeDir, `_${this._cacheFilePathPrefix}@${this._packageVersion}@${this._packageName}`);
    }

    private async _prepare() {
        if (this._storeDir && !pathExistsSync(this._storeDir)) {
            // 缓存路径不存在 创建缓存路径（包括所有不存在父路径）
            fse.mkdirpSync(this._storeDir);
        }
        if (this._packageVersion === 'latest') {
            this._packageVersion = await getLatestVersion(this._packageName);
        }
    }

    // 获取缓存node_modules中特定版本的包路径
    private _getSpecificCacheFilePath(version: string): string {
        return path.resolve(this._storeDir, `_${this._cacheFilePathPrefix}@${version}@${this._packageName}`);
    }

    /**
     * 判断当前package是否存在
     */
    public async exists(): Promise<boolean> {
        if (this._storeDir) {
            // 缓存模式
            await this._prepare();
            return pathExistsSync(this._cacheFilePath);
        }
        return pathExistsSync(this._targetPath);
    }

    /**
     * 安装
     */
    public async install() {
        await this._prepare();
        return npminstall({
            root: this._targetPath,
            storeDir: this._storeDir,
            registry: DEFAULT_REGISTRY,
            pkgs: [{
                name: this._packageName,
                version: this._packageVersion,
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
        await this._prepare();
        const latestVersion: string = await getLatestVersion(this._packageName);
        const latestCacheFilePath: string = this._getSpecificCacheFilePath(latestVersion);
        if (!pathExistsSync(latestCacheFilePath)) {
            await npminstall({
                root: this._targetPath,
                storeDir: this._storeDir,
                registry: DEFAULT_REGISTRY,
                pkgs: [{
                    name: this._packageName,
                    version: latestVersion,
                }],
            });
        }
        this._packageVersion = latestVersion;
    }

    /**
     * 获取入口文件路径
     * 1. 获取package.json所在目录
     * 2. 读取package.json
     * 3. 寻找main/lib
     * 4. 不同系统路径兼容
     */
    public getRootFilePath(): string {
        const getPathFn = (target: string): string => {
            const pkgDir: string = pkgDirSync(target);
            if (pkgDir) {
                const pkgFile = readJsonFile(path.resolve(pkgDir, 'package.json'));
                if (pkgFile && pkgFile.main) {
                    return formatPath(path.resolve(pkgDir, pkgFile.main));
                }
            }
            return null;
        };
        return getPathFn(this._storeDir ? this._cacheFilePath : this._targetPath);
    }
}

export default Package;
