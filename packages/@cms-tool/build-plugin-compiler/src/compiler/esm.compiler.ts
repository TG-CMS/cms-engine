import * as path from 'path';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import {getPreset} from '@tgcms/babel-config';
import {log} from '@tgcms/util'
import * as babel from '@babel/core';
import {REG_JS,REG_D_TS} from '../constant';
import {dtsCompiler} from './dts.compiler'

export function getBabelCompilerConfig(target:string){
  const params = target === 'es' ? {
    modules: false,
    useBuiltIns: 'entry',
    corejs: '3.7',
  } : {};
  const defaultBabel = getPreset({
    vue:false,
    typescript: true,
    react:true,
    env: params
  });
  const additionalPlugins = [
    [require.resolve('@babel/plugin-transform-runtime'), {
      corejs: false,
      helpers: true,
      regenerator: true,
      useESModules: false,
    }],
  ];
  defaultBabel.plugins = [...defaultBabel.plugins, ...additionalPlugins];
  return defaultBabel;
}



export function babelCompiler(context){
  const { rootDir=process.cwd(), pkg } = context;
  const srcPath = path.join(rootDir, 'src');
  const compileTargets = ['es', 'lib'];
  const filesPath = glob.sync('**/*.*', { cwd: srcPath, ignore: ['node_modules/**', '*.d.ts', '*.?(ali|wechat).?(ts|tsx|js|jsx)'] });
  const compileInfo = [];
  compileTargets.forEach((target) => {
    const destPath = path.join(rootDir, target);
    fs.emptyDirSync(destPath);
    const libBabelConfig=getBabelCompilerConfig(target);
    filesPath.forEach((filePath) => {
      console.log(filePath);
      const sourceFile = path.join(srcPath, filePath);

      if (!REG_JS.test(filePath) || REG_D_TS.test(filePath)) {
        // copy file if it does not match REG_JS
        try {
          fs.copySync(sourceFile, path.join(destPath, filePath));
          log.info(filePath,` copy successfully!`);
        } catch (err) {
          log.error(filePath,err);
        }
        return
      }
      const rightPath = filePath.replace(REG_JS, '.js');
      const { code } = babel.transformFileSync(sourceFile, {
        filename: rightPath,
        ...libBabelConfig,
      });
      const targetPath = path.join(destPath, rightPath);
      fs.ensureDirSync(path.dirname(targetPath));
      fs.writeFileSync(targetPath, code, 'utf-8');
      compileInfo.push({
        filePath,
        sourceFile,
        destPath,
      });
    })
  });
  dtsCompiler(compileInfo);
  log.info("compiler",'Generate es and lib successfully!');

}
