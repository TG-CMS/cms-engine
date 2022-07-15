import {homedir} from "os";
import * as path from "path";
export const LOG_LEVEL=process.env.CMS_LOG_LEVEL;
export const LOG=process.env.CMS_LOG;
export const WS_SERVER =process.env.CMS_WS_SERVER;
export const HTTP_SERVER =process.env.CMS_HTTP_SERVER;
export const LOWEST_NODE_VERSION="14.0.0";
export const registryUrl=process.env.CMS_REGISTRY||"https://registry.npmjs.org";
export const DEPENDENCIES_PATH='dependencies';
export const DEFAULT_CLI_HOME='.tgcms';
export const NPM_NAME= '@tgcms-cli';
export const userHome=homedir();
export const DB_MATERIALS = '.build/materials.json';

// 临时缓存目录
export const TEMP_PATH = path.join(process.cwd(), `${DEFAULT_CLI_HOME}-tmp`);
