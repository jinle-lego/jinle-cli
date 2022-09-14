import semver from 'semver';
import log, { updateLogLevel } from '@jinle-cli/log';
import colors from 'colors/safe';
import rootCheck from 'root-check';
import { homedir } from 'os';
import pathExists from 'path-exists';
import minimist from 'minimist';
import * as dotenv from 'dotenv';
import path from 'path';

import pkg from '../package.json';
import { LOWEST_NODE_VERSION, DEFAULT_CLI_HOME } from './constant';

const checkPkgVersion = (_pkg: any) => {
    log.info('jinle-cli', `v${_pkg.version}`);
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
        // 自动找到根目录下的.env文件，将数据都写入环境变量
        dotenv.config({
            path: dotenvPath,
        });
    }
    createDefaultConfig();
    log.verbose('env', process.env.CLI_HOME_PATH);
};

export default (argv: string[]) => {
    try {
        const args = minimist(argv);

        checkPkgVersion(pkg);
        checkNodeVersion();
        checkRoot();
        checkUserHome();
        checkInputArgs(args);
        checkEnv();
    } catch (err) {
        log.error('cli', err?.message || err);
    }
};
