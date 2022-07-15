import * as npmlog from 'npmlog';
import {LOG_LEVEL} from './const.util';
const envs = ['verbose', 'info', 'error', 'warn'];
const logLevel = envs.indexOf(LOG_LEVEL) !== -1 ? LOG_LEVEL : 'info';
// @ts-ignore
npmlog.level = logLevel;
export const log=npmlog;
