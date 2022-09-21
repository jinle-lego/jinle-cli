import { isObject } from '@jinle-cli/utils';

import { PackageOptions } from './types';

class Package {
    private targetPath: string; // package路径

    private storeDir: string; // package存储路径

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
    public static exists() {}

    /**
     * 安装
     */
    public static install() {}

    /**
     * 更新
     */
    public static update() {}

    /**
     * 获取入口文件路径
     */
    public static getRootFilePath() {}
}

export default Package;
