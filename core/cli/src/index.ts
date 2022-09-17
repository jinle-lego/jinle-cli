import semver from 'semver';
import log, { updateLogLevel } from '@jinle-cli/log';
import colors from 'colors/safe';
import rootCheck from 'root-check';
import { homedir } from 'os';
import pathExists from 'path-exists';
import minimist from 'minimist';
import * as dotenv from 'dotenv';
import path from 'path';
import { getLatestVersion } from '@jinle-cli/get-npm-info';
import dedent from 'dedent';

import pkg from '../package.json';
import { LOWEST_NODE_VERSION, DEFAULT_CLI_HOME } from './constant';

const checkPkgVersion = () => {
    log.info('jinle-cli', `v${pkg.version}`);
};

const checkNodeVersion = () => {
    const curVersion = process.version; // 当前node版本
    const lowestVersion = LOWEST_NODE_VERSION;
    if (!semver.gte(curVersion, lowestVersion)) {
        // 当前版本低于最低版本
        throw new Error(colors.red(`jinle-cli 需安装 v${lowestVersion} 以上的 Node.js 版本`));
    }
};

/**
 * 检查root权限
 */
const checkRoot = () => {
    rootCheck(); // 降级
    // console.log(process.geteuid()); // 501-普通权限 0-root
};

/**
 * 检查用户主目录
 */
const checkUserHome = () => {
    if (!homedir() || !pathExists(homedir())) {
        throw new Error(colors.red('当前用户主目录不存在'));
    }
};

/**
 * 检查入参
 */
const checkInputArgs = (args: minimist.ParsedArgs) => {
    // 判断 debug 模式
    process.env.LOG_LEVEL = args.debug ? 'verbose' : 'info';
    updateLogLevel();
    log.verbose('debug', colors.yellow('进入 debug 模式'));
};

/**
 * 设置默认环境变量
 */
const createDefaultConfig = () => {
    process.env.CLI_HOME_PATH = path.join(
        homedir(),
        process.env.CLI_HOME ? process.env.CLI_HOME : DEFAULT_CLI_HOME,
    );
};

/**
 * 检查环境变量
 */
const checkEnv = () => {
    const dotenvPath = path.resolve(homedir(), '.env');
    if (pathExists(dotenvPath)) {
        // 找到根目录下的.env文件，将数据都写入环境变量
        dotenv.config({
            path: dotenvPath,
        });
    }
    createDefaultConfig();
    log.verbose('env', process.env.CLI_HOME_PATH);
};

/**
 * 检查是否为最新版本
 * 1. 获取当前版本号和模块名
 * 2. 调用 npm API 获取所有版本号
 * 3. 提取所有版本号 比对大于当前的版本号
 * 4. 获取用户版本号 提示更新
 */
const checkGlobalUpdate = async () => {
    const curVersion: string = pkg.version;
    const npmName: string = pkg.name;
    const latestVersion: string = await getLatestVersion(curVersion, npmName);
    if (latestVersion && semver.gt(latestVersion, curVersion)) {
        log.warn(
            '更新提示',
            colors.yellow(
                dedent`请手动更新${npmName}，当前版本: ${curVersion}，最新版本: ${latestVersion}
                更新命令: npm install -g ${npmName}@latest`,
            ),
        );
    } else {
        log.info('', colors.yellow(`当前处于最新版本: v${latestVersion}`));
    }
};

export default async (argv: string[]) => {
    try {
        const args = minimist(argv);

        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
        checkUserHome();
        checkInputArgs(args);
        checkEnv();
        await checkGlobalUpdate();
    } catch (err) {
        log.error('cli', err?.message || err);
    }
};
