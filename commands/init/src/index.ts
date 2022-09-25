import Command from '@jinle-cli/command';
import log from '@jinle-cli/log';

export class InitCommand extends Command {
    public init() {
        const projectName: string = this._argv[0] || '';
        const { force }: { force: boolean } = this._cmdOptions;
        log.verbose('projectName', projectName);
        log.verbose('force', force.toString());
    }

    public exec() {
        console.log('init业务逻辑');
    }
}

const init = (argv: any[]) => {
    const cmd = new InitCommand(argv);
};

export default init;
