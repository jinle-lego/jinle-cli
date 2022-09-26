import fs from 'fs';
import { sync as pkgDirSync } from 'pkg-dir';
import path from 'path';
import cp from 'child_process';

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

/**
 * 启动spawn（兼容windows）
 */
export const spawn = (command: string, args: readonly string[], options: cp.SpawnOptions = {}): cp.ChildProcess => {
    const win32: boolean = process.platform === 'win32';
    const cmd: string = win32 ? 'cmd' : command;
    const cmdArgs: readonly string[] = win32 ? ['/c'].concat(command, args) : args;
    return cp.spawn(cmd, cmdArgs, options);
};
