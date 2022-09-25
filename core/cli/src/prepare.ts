import semver from 'semver';
import log from '@jinle-cli/log';
import colors from 'colors/safe';
import rootCheck from 'root-check';
import { homedir } from 'os';
import { sync as pathExistsSync } from 'path-exists';
import * as dotenv from 'dotenv';
import path from 'path';
import { getSemverVersion } from '@jinle-cli/get-npm-info';
import dedent from 'dedent';
import { readPackageJson } from '@jinle-cli/utils';

import { DEFAULT_CLI_HOME } from './constant';

const pkg = readPackageJson(__dirname);

const checkPkgVersion = () => {
    log.info('jinle-cli', `v${pkg.version}`);
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
    if (!homedir() || !pathExistsSync(homedir())) {
        throw new Error(colors.red('当前用户主目录不存在'));
    }
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
    // 找到根目录下的.env文件，将数据都写入环境变量
    pathExistsSync(dotenvPath) && dotenv.config({
        path: dotenvPath,
    });
    createDefaultConfig();
    // log.verbose('CLI_HOME_PATH', process.env.CLI_HOME_PATH);
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
    const latestVersion: string = await getSemverVersion(curVersion, npmName);
    if (latestVersion && semver.gt(latestVersion, curVersion)) {
        log.warn(
            '更新提示',
            colors.yellow(
                dedent`请手动更新${npmName}，当前版本: ${curVersion}，最新版本: ${latestVersion}
                更新命令: npm install -g ${npmName}@latest`,
            ),
        );
    } else {
        log.info('', colors.yellow(`当前处于最新版本: ${latestVersion}`));
    }
};

const prepare = async () => {
    checkPkgVersion();
    checkRoot();
    checkUserHome();
    checkEnv();
    // await checkGlobalUpdate();
};

export default prepare;
