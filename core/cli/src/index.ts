import log, { updateLogLevel } from '@jinle-cli/log';
import colors from 'colors/safe';
import { Command } from 'commander';
import exec from '@jinle-cli/exec';
import { readPackageJson } from '@jinle-cli/utils';

import prepare from './prepare';

const pkg = readPackageJson(__dirname);

const registerCommander = () => {
    const program: Command = new Command();

    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d --debug', '是否开启debug模式', false)
        .option('-tp --targetPath <targetPath>', '是否指定本地调试文件路径', '');

    program
        .command('init [projectName]')
        .description('初始化项目')
        .option('-f --force', '强制初始化项目')
        .action(exec);

    // 判断debug模式
    program.on('option:debug', () => {
        updateLogLevel(program.opts().debug ? 'verbose' : 'info');
        log.verbose('debug', colors.yellow('进入 debug 模式'));
    });

    // 指定包执行命令
    program.on('option:targetPath', (targetPath) => {
        process.env.CLI_TARGET_PATH = targetPath;
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
        await prepare();
        registerCommander();
    } catch (err) {
        log.error('cli', err?.message || err);
    }
};
