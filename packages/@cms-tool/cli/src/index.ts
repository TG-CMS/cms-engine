#!/usr/bin/env node
import * as fs from "fs";
import * as path from 'path';
import * as fes from  'fs-extra'
import * as colors  from 'colors/safe';
import * as program from 'commander';
import * as semver from 'semver';
import * as figlet from 'figlet';
import * as chalk from 'chalk';
import {log,userHome,DEFAULT_CLI_HOME,LOWEST_NODE_VERSION,getNpmLatestSemverVersion,NPM_NAME} from '@tgcms/util';
import init from './init.command';
import start from './start.command';
import build from './build.command';
import add from './add.command';
import generate from './generate.command';
import sync from './sync.command';
const packageConfig = fes.readJSONSync(path.join(__dirname, '..', 'package.json'));
let args;
let config;
export  function Command(){
  program.
    name('tgcms')
    .description('tgcms cil to some tool ').
  version(packageConfig.version,'-v, --version','显示当前版本号').helpOption('-h,--help','显示帮助信息').usage('<command> [options]');
  program
    .command('init [template]')
    .description('项目初始化')
    .allowUnknownOption()
    .option('--force', '覆盖当前路径文件（谨慎使用）')
    .on('--help', () => {
      console.log('');
      console.log('Examples:');
      console.log('  $ tgcms init');
      console.log('  $ tgcms init block');
    })
    .action(init);
  program
    .command('start')
    .description('项目启动')
    .allowUnknownOption()
    .option('-p, --port <port>', '指定启动端口')
    .action(start);


  program
    .command('build [type]')
    .description('项目打包')
    .allowUnknownOption()
    .on('--help', () => {
      console.log('');
      console.log('Examples:');
      console.log('  $ tgcms build');
      console.log('  $ tgcms build block');
    })
    .action(build);
  program
    .command('add [materialType] [npmName]')
    .description('add block to current directory')
    .allowUnknownOption()
     .option('-n <name>', 'Specify the block directory name like CustomBlock')
    .on('--help', () => {
      console.log('');
      console.log('Examples:');
      console.log('  $ tgcms add');
      console.log('  $ tgcms add block');
      console.log('  $ tgcms add @icedesign/user-landing-block');
      console.log('  $ tgcms add @icedesign/user-landing-block -n CustomBlock');
    })
    .action(add)


  program
    .command('generate [type]')
    .description('generate material collection data(material.json)')
    .allowUnknownOption()
    .on('--help', () => {
      console.log('');
      console.log('Examples:');
      console.log('  $ tgcms generate');
    })
    .action(generate);
  program
    .command('sync [type]')
    .description('sync materials data to CMS Material Center')
    .allowUnknownOption()
    .option('-e, --env <env>', 'Specify  env, support dev|prod')
    .option('-h, --host <host>', 'Specify  env, support dev|prod')
    .on('--help', () => {
      console.log('');
      console.log('Examples:');
      console.log('  $ tgcms sync');
      console.log('  $ tgcms sync --dev');
    })
    .action(sync);

  program.on('--help',function(){
    console.log('');
    console.log(
      "\r\n" +
      chalk.green(figlet.textSync("tgcms-cli", {
        font: "3D-ASCII",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 400,
        whitespaceBreak: true,
      }))
    );
    console.log(chalk.green('Examples:'));
    console.log(chalk.green('  $ tgcms init'));
    console.log(chalk.green('  $ tgcms init component'));
  });
  program
    .option('--debug', 'open debug')
    .parse(process.argv);
  if (args._.length < 1) {
    program.outputHelp();
    console.log();
  }
};
function checkInputArgs() {
  log.verbose("check",'开始校验输入参数');
  const minimist = require('minimist');
  args = minimist(process.argv.slice(2)); // 解析查询参数
  log.verbose("check",'输入参数', args);
}
function checkRoot() {
  const rootCheck = require('root-check');
  rootCheck(colors.red('请避免使用 root 账户启动本应用'));
}
function checkUserHome() {
  if (!userHome || !fs.existsSync(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在！'));
  }
}
function checkNodeVersion() {
  const semver = require('semver');
  if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
    throw new Error(colors.red(`tgcms-cli 需要安装 v${LOWEST_NODE_VERSION} 以上版本的 Node.js`));
  }
}
function createCliConfig(){
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig['cliHome'] = path.join(userHome, DEFAULT_CLI_HOME);
  }
  return cliConfig;
}
function checkEnv() {
  log.verbose('','开始检查环境变量');
  const dotenv = require('dotenv');
  dotenv.config({
    path: path.resolve(userHome, '.env'),
  });
  config = createCliConfig(); // 准备基础配置
  log.verbose('环境变量', config);
}

function checkPkgVersion() {
  log.notice('tgcms-cli', packageConfig.version);
}
export async function prepare(){
  checkPkgVersion();
  checkNodeVersion();
  checkRoot();
  checkUserHome();
  checkInputArgs();
  checkEnv();
  // await checkGlobalUpdate();
}

async function checkGlobalUpdate() {
  log.verbose('',`检查 ${NPM_NAME} 最新版本`);
  const currentVersion = packageConfig.version;
  const lastVersion = await getNpmLatestSemverVersion(NPM_NAME, currentVersion);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn('',colors.yellow(`请手动更新 ${NPM_NAME}，当前版本：${packageConfig.version}，最新版本：${lastVersion}
                更新命令： npm install -g ${NPM_NAME}`));
  }
}
 async function cli(){
  try {
    await prepare();
    Command();
  } catch (e) {
    log.error('',e);
  }
}
cli()
