import semver from 'semver';
import colors from 'colors/safe';
import log from '@jinle-cli/log';

export const LOWEST_NODE_VERSION: string = '16.0.0'; // 当前最低版本号

class Command {
    protected _argv: any[];

    protected _cmd: any;

    protected _cmdOptions: any;

    constructor(argv: any[]) {
        if (!argv || !Array.isArray(argv) || !argv.length) {
            throw new Error('Command传参有误');
        }
        this._argv = argv;
        const runner = new Promise((resolve, reject) => {
            let chain = Promise.resolve();
            chain = chain.then(() => this._checkNodeVersion());
            chain = chain.then(() => this._initArgs());
            chain = chain.then(() => this.init());
            chain = chain.then(() => this.exec());
            chain.catch((err) => {
                log.error('Command', err.message || err);
            });
        });
    }

    private _checkNodeVersion = () => {
        const curVersion = process.version; // 当前node版本
        const lowestVersion = LOWEST_NODE_VERSION;
        if (!semver.gte(curVersion, lowestVersion)) {
            // 当前版本低于最低版本
            throw new Error(colors.red(`jinle-cli 需安装 v${lowestVersion} 以上的 Node.js 版本`));
        }
    };

    private _initArgs() {
        this._cmd = this._argv[this._argv.length - 1];
        this._cmdOptions = this._argv[this._argv.length - 2];
        this._argv = this._argv.slice(0, this._argv.length - 2);
    }

    public init() {
        throw new Error('init必须定义');
    }

    public exec() {
        throw new Error('exec必须定义');
    }
}

export default Command;
