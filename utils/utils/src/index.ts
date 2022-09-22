import fs from 'fs';
import { sync as pkgDirSync } from 'pkg-dir';
import path from 'path';

/**
 * 判断是否对象
 */
export const isObject = (obj: any): Boolean => Object.prototype.toString.call(obj) === '[object Object]';

/**
 * 读取JSON文件
 * @param p 文件路径
 * @returns json文件
 */
export const readJsonFile = (p: string) => JSON.parse(fs.readFileSync(p, 'utf-8'));

/**
 * 读取路径向上最近的package.json文件
 * @param p 文件路径
 * @returns package.json文件
 */
export const readPackageJson = (p: string) => {
    const pkgDir: string = pkgDirSync(p);
    if (pkgDir) {
        return readJsonFile(path.resolve(pkgDir, 'package.json'));
    }
    return null;
};
