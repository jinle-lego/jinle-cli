import { isObject, readJsonFile } from '@jinle-cli/utils';
import { sync as pkgDirSync } from 'pkg-dir';
import path from 'path';
import formatPath from '@jinle-cli/format-path';
import npminstall from 'npminstall';
import { DEFAULT_REGISTRY } from '@jinle-cli/get-npm-info';

import { PackageOptions } from './types';

class Package {
    private targetPath: string; // package路径

    private storeDir: string; // package缓存路径

    private packageName: string;

    private packageVersion: string;

    constructor(options: PackageOptions) {
        if (!options || !isObject(options)) {
            throw new Error('Package类传参有误！');
        }
        this.targetPath = options.targetPath;
        this.storeDir = options.storeDir;
        this.packageName = options.packageName;
        this.packageVersion = options.packageVersion;
    }

    /**
     * 判断当前package是否存在
     */
    public exists() {
        console.log(this.targetPath);
        return false;
    }

    /**
     * 安装
     */
    public async install() {
        await npminstall({
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
     */
    public static update() {}

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
