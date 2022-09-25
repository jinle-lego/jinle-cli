import Package from '@jinle-cli/package';
import log from '@jinle-cli/log';
import path from 'path';
import cp from 'child_process';

import { COMMAND_PACKAGE_NAME, CATCH_DIR } from './constant';

const exec = async (...args: any[]) => {
    const homePath: string = process.env.CLI_HOME_PATH;
    let targetPath: string = process.env.CLI_TARGET_PATH;
    let storeDir: string;
    const cmd: any = args[args.length - 1];
    // const cmdOptions: any = args[args.length - 2];
    const cmdName: string = cmd.name(); // 命令名称
    const packageName: string = COMMAND_PACKAGE_NAME[cmdName];
    const packageVersion: string = 'latest';

    let pkg: Package = null;

    if (!targetPath) {
        // 不执行指定包代码，使用缓存包
        targetPath = path.resolve(homePath, CATCH_DIR); // 生成缓存路径
        storeDir = path.resolve(targetPath, 'node_modules');
        log.info('exec', `使用此包执行该命令:${packageName}@${packageVersion}`);
        pkg = new Package({
            targetPath,
            storeDir,
            packageName,
            packageVersion,
        });
        if (await pkg.exists()) {
            // 更新
            await pkg.update();
        } else {
            // 安装
            await pkg.install();
        }
    } else {
        // 执行指定包代码
        log.info('exec', `使用此包执行该命令:${targetPath}`);
        pkg = new Package({
            targetPath,
            packageName,
            packageVersion,
        });
    }

    try {
        const rootFile: string = pkg.getRootFilePath();
        if (rootFile) {
            // 当前进程调用
            // (await import(rootFile)).default(args);
            // 子进程调用
            const newCmd = Object.create(null);
            Object.keys(cmd).forEach((key) => {
                // 处理cmdObj，过滤多余属性
                Object.prototype.hasOwnProperty.call(cmd, key)
                && !key.startsWith('_')
                && key !== 'parent'
                && (newCmd[key] = cmd[key]);
            });
            const code: string = `require("${rootFile}").default.call(null, ${JSON.stringify([...args.slice(0, -1), newCmd])});`;
            const child: cp.ChildProcess = cp.spawn('node', ['-e', code], {
                cwd: process.cwd(),
                stdio: 'inherit',
            });
            child.on('error', (e) => {
                log.error('exec', e.message);
                process.exit(1);
            });
            child.on('exit', (e) => {
                log.verbose('exec', `命令执行成功:${e}`);
                process.exit(e);
            });
        }
    } catch (err) {
        log.error('exec', err?.message || err);
    }
};

export default exec;
