import semver from 'semver';
import log, { updateLogLevel } from '@jinle-cli/log';
import colors from 'colors/safe';
import rootCheck from 'root-check';
import { homedir } from 'os';
import { sync as pathExistsSync } from 'path-exists';
import minimist from 'minimist';
import * as dotenv from 'dotenv';
import path from 'path';
import { getLatestVersion } from '@jinle-cli/get-npm-info';
import dedent from 'dedent';
import { Command } from 'commander';
import init from '@jinle-cli/init';

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
    if (!homedir() || !pathExistsSync(homedir())) {
        throw new Error(colors.red('当前用户主目录不存在'));
    }
};

/**
 * 检查入参
 */
const checkInputArgs = (argv: string[]) => {
    // 判断debug模式
    updateLogLevel(minimist(argv).debug ? 'verbose' : 'info');
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
    // 找到根目录下的.env文件，将数据都写入环境变量
    pathExistsSync(dotenvPath) && dotenv.config({
        path: dotenvPath,
    });
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
        log.info('', colors.yellow(`当前处于最新版本: ${latestVersion}`));
    }
};

const registerCommander = () => {
    const program: Command = new Command();

    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d --debug', '是否开启debug模式', false);

    program
        .command('init [projectName]')
        .description('初始化项目')
        .option('-f --force', '强制初始化项目')
        .action(init);

    // 判断debug模式
    program.on('option:debug', () => {
        if (program?.args?.length) {
            updateLogLevel(program.opts().debug ? 'verbose' : 'info');
            log.verbose('debug', colors.yellow('进入 debug 模式'));
        }
    });

    // 未知命令监听
    program.on('command:*', (args: string[]) => {
        const availableCommands: string[] = program.commands.map((cmd) => cmd.name());
        log.error('', colors.red(`未知命令: ${args[0]}`));
        availableCommands.length && log.info('', `可用命令: ${availableCommands.join(', ')}`);
    });

    program.parse(process.argv);

    if (program.args && !program.args.length) {
        // 没有输入command 展示help信息
        program.outputHelp();
    }
};

export default async (argv: string[]) => {
    try {
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
        checkUserHome();
        // checkInputArgs(argv);
        checkEnv();
        // await checkGlobalUpdate();
        registerCommander();
    } catch (err) {
        log.error('cli', err?.message || err);
    }
};
