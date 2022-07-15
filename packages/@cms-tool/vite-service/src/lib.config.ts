import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import {build, InlineConfig} from 'vite';
import {Context} from '@tgcms/util';
import * as path from 'path';
export function libConfig(context:Context,{minify=false}):InlineConfig{
  const {rootDir,commandArgs={},entry,componentName}=context;
  const esDir=path.join(rootDir,'es');
  const umdDir=path.join(rootDir,'dist');
  return {
    base:'/',
    configFile: false,
    root:rootDir,
    plugins: [
      vue(),
      vueJsx(),

    ],
    build:{
      target: 'modules',
      minify:minify,
      emptyOutDir:false,
      rollupOptions:{
        external: ['vue', /\.less/,/\.scss/,/\.css/],
        output: [
          {
            format: 'es',
            entryFileNames:  `[name]${minify?'.min':''}.js`,
            preserveModules: true,
            dir: esDir,
            preserveModulesRoot: 'src'
          },
          {
            format: 'umd',
            entryFileNames:  `[name]${minify?'.min':''}.js`,
            preserveModules: true,
            dir: umdDir,
            preserveModulesRoot: 'src',
          }
        ]
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
