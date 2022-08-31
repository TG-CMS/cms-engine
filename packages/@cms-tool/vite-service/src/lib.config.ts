import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dts from 'vite-plugin-dts'
import {build, InlineConfig} from 'vite';
import {Context} from '@tgcms/util';
import * as path from 'path';
export function libConfig(context:Context,{minify=false}):InlineConfig{
  const {rootDir,entry,componentName}=context;
  // const esDir=path.join(rootDir,'es');
  const dir=path.join(rootDir,'dist');
  const  output:any[]= [
    {
      format: 'umd',
      entryFileNames:  `[name].umd${minify?'.min':''}.js`,
      preserveModules: false,
      dir,
      preserveModulesRoot: 'src',
      globals: {
        vue: 'Vue'
      },
    }
  ];
 // es 模块不需要生成压缩
 if (!minify){
   output.push({
     format: 'es',
     entryFileNames:  `[name].esm${minify?'.min':''}.js`,
     preserveModules: true,
     dir,
     exports:'auto',
     preserveModulesRoot: 'src'
   },)
 }
 const plugins= [
    vue(),
    vueJsx(),
 ];
 if (!minify){
   plugins.push(dts(
     {
       outputDir:['dist'],
       tsConfigFilePath:path.join(__dirname,'../config/tsconfig.json')
     }
   ),)
 }
  return {
    base:'/',
    configFile: false,
    root:rootDir,
    plugins,
    build:{
      target: 'modules',
      minify:minify,
      emptyOutDir:false,
      rollupOptions:{
        external: ['vue', /\.less/,/\.scss/,/\.css/],
        output,
      },
      lib: {
        entry,
        name: componentName,
      }
    },
  }
}
export async function viteLibBuild(context:Context){
  await build(libConfig(context,{minify:false}));
  await build(libConfig(context,{minify:true}));
}
