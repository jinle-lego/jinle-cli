import Package from '@jinle-cli/package';
import log from '@jinle-cli/log';

// 包名映射
const COMMAND_PACKAGE_NAME: { [key: string]: string } = {
    init: '@jinle-cli/init',
};

const exec = (...args: any[]) => {
    const targetPath: string = process.env.CLI_TARGET_PATH;
    log.verbose('targetPath', targetPath);
    const homePath: string = process.env.CLI_HOME_PATH;
    log.verbose('homePath', homePath);

    const cmd: any = args[args.length - 1];
    const cmdOptions: any = args[args.length - 2];
    const cmdName: string = cmd.name(); // 命令名称
    const packageName: string = COMMAND_PACKAGE_NAME[cmdName];
    const packageVersion: string = 'latest';

    const pkg = new Package({
        targetPath,
        storeDir: homePath,
        packageName,
        packageVersion,
    });
    console.log(pkg);
};

export default exec;
