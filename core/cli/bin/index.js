#! /usr/bin/env node

const importLocal = require('import-local');

if (importLocal(__filename)) {
    require('npmlog').info('正在使用 jinle-cli 本地版本');
} else {
    require('../dist')(process.argv.slice(2));
}
