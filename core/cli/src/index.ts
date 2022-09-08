import semver from 'semver';
import log from '@jinle-cli/log';
import colors from 'colors/safe';

import pkg from '../package.json';
import { LOWEST_NODE_VERSION } from './constant';

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

const core = (argv: String[]) => {
    try {
        log.info('argv:', JSON.stringify(argv));
        checkPkgVersion(pkg);
        checkNodeVersion();
    } catch (err) {
        log.error('core', err?.message || err);
    }
};

export default core;
