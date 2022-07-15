import * as path from 'path';
import * as fs from 'fs-extra';
import {log} from './log.util';
import {DEPENDENCIES_PATH,userHome} from './const.util'
import {NpmPackage} from './package.util';
function handleError(e) {
  log.error('Error:', e.stack);
  process.exit(1);
}

export function exec(command, args, options) {
  const win32 = process.platform === 'win32';

  const cmd = win32 ? 'cmd' : command;
  const cmdArgs = win32 ? ['/c'].concat(command, args) : args;

  return require('child_process').spawn(cmd, cmdArgs, options || {});
}
export async function execCommand({ packagePath, packageName, packageVersion }, options) {
  let rootFile;
  try {
    if (packagePath) {
      const execPackage = new NpmPackage({
        targetPath: packagePath,
        storePath: packagePath,
        name: packageName,
        version: packageVersion,
      });
      rootFile = execPackage.getRootFilePath(true);
    } else {
      const { cliHome=userHome } = options;
      const packageDir = `${DEPENDENCIES_PATH}`;
      const targetPath = path.resolve(cliHome, packageDir);
      const storePath = path.resolve(targetPath, 'node_modules');
      const initPackage = new NpmPackage({
        targetPath,
        storePath,
        name: packageName,
        version: packageVersion,
      });
      if (await initPackage.exists()) {
        await initPackage.update();
      } else {
        await initPackage.install();
      }
      rootFile = initPackage.getRootFilePath();
    }
    const _config = Object.assign({}, options);
    if (fs.existsSync(rootFile)) {
      const code = `require('${rootFile}')(${JSON.stringify(_config)})`;
      const p = exec('node', ['-e', code], { 'stdio': 'inherit' });
      p.on('error', e => {
        log.verbose('命令执行失败:', e);
        handleError(e);
        process.exit(1);
      });
      p.on('exit', c => {
        log.verbose('命令执行成功:', c);
        process.exit(c);
      });
    } else {
      throw new Error('入口文件不存在，请重试！');
    }
  } catch (e) {
    log.error("Error",e.message);
  }
}
