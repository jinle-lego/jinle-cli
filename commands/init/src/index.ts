import fs from 'fs';
import Command from '@jinle-cli/command';
import log from '@jinle-cli/log';

export class InitCommand extends Command {
    public projectName: string;

    public force: boolean;

    public init() {
        this.projectName = this._argv[0] || '';
        this.force = this._cmdOptions.force || false;
        log.verbose('projectName', this.projectName);
        log.verbose('force', this.force.toString());
    }

    public exec() {
        // 1. 准备阶段
        this._prepare();
        // 2. 下载模板
        // 3. 安装模板
    }

    private _prepare() {
        // 1. 判断当前目录是否为空
        if (!this._isCwdEmpty()) {
            // 询问是否继续创建
        }
        // 2. 是否强制清空
        // 3. 选择项目或组件
        // 4. 获取项目/组件基本信息
    }

    // 判断当前目录是否为空
    private _isCwdEmpty() {
        const localPath: string = process.cwd(); // 当前工作目录
        let fileList: string[] = fs.readdirSync(localPath);
        // 忽略文件
        fileList = fileList.filter((file) => (
            !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
        ));
        return !fileList || fileList.length <= 0;
    }
}

const init = (argv: any[]) => {
    const cmd = new InitCommand(argv);
};

export default init;
