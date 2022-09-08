const semver = require('semver');
const colors = require('colors/safe');
const log = require('@jinle-cli/log');

const pkg = require('../package.json');
const { LOWEST_NODE_VERSION } = require('./constant');

const checkPkgVersion = (_pkg) => {
    log.info(`jinle-cli v${_pkg.version}`);
};

const checkNodeVersion = () => {
    const curVersion = process.version; // 当前node版本
    const lowestVersion = LOWEST_NODE_VERSION;
    if (!semver.gte(curVersion, lowestVersion)) {
        // 当前版本低于最低版本
        throw new Error(colors.red(`jinle-cli 需安装 v${lowestVersion} 以上的 Node.js 版本`));
    }
};

const core = () => {
    try {
        checkPkgVersion(pkg);
        checkNodeVersion();
    } catch (err) {
        log.error(err?.message || err);
    }
};

module.exports = core;
