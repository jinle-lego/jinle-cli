import fs from 'fs';
import Command from '@jinle-cli/command';
import log from '@jinle-cli/log';
import inquirer from 'inquirer';
import path from 'path';
import fse from 'fs-extra';

export class InitCommand extends Command {
    public projectName: string;

    public projectPath: string; // 创建项目的目录

    public force: boolean;

    public init() {
        this.projectName = this._argv[0] || '';
        this.force = this._cmdOptions.force || false;
        this.projectPath = path.resolve(process.cwd(), this.projectName);
        log.verbose('projectName', this.projectName);
        log.verbose('force', this.force.toString());
    }

    public async exec() {
        // 1. 准备阶段
        await this._prepare();
        // 2. 下载模板
        // 3. 安装模板
    }

    private async _prepare() {
        // 1. 判断当前目录是否为空
        if (!this._isDirEmpty(this.projectPath)) {
            // 目录存在且不为空
            let ifContinue: boolean = false;
            if (!this.force) {
                // 询问是否继续创建
                ifContinue = (await inquirer.prompt({
                    type: 'confirm',
                    name: 'ifContinue',
                    default: false,
                    message: `${this.projectName}不为空，是否继续创建？`,
                })).ifContinue;
                if (!ifContinue) {
                    return;
                }
            }
            // 2. 是否强制清空
            if (ifContinue || this.force) {
                const { ifClean }: { ifClean: boolean } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'ifClean',
                    default: false,
                    message: `是否清空${this.projectName}以创建新项目/组件？`,
                });
                // 清空指定目录
                ifClean && fse.emptyDirSync(this.projectPath);
            }
        }
        // 3. 选择项目或组件
        // 4. 获取项目/组件基本信息
    }

    // 判断当前目录是否为空
    private _isDirEmpty(p: string) {
        if (!fse.pathExistsSync(p)) {
            // 目录不存在
            return true;
        }
        // 目录存在
        const fileList: string[] = fs.readdirSync(p);
        return !fileList || fileList.length <= 0;
    }
}

const init = (argv: any[]) => {
    const cmd = new InitCommand(argv);
};

export default init;
