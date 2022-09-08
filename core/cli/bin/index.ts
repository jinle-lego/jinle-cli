#! /usr/bin/env node

import importLocal from 'import-local';
import log from 'npmlog';
import cli from '../src';

if (importLocal(__filename)) {
    log.info('jinle-cli', '正在使用 jinle-cli 本地版本');
} else {
    cli(process.argv.slice(2));
}
