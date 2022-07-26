import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import {HmrOptions, InlineConfig} from 'vite';
import {VietHtmlPlugin} from './plugin';
import * as path from "path";
export function buildConfig(context):InlineConfig{
  const {rootDir,commandArgs={}}=context;
  const publicDir=path.join(rootDir, './public');
  const hmr:HmrOptions={
    port: commandArgs.port || 3333,
    host: commandArgs.host || '0.0.0.0',
  }
  return {
    server: {
      hmr,
    },
    base:'/',
    configFile: false,
    root:rootDir,
    publicDir,
    plugins: [
      vue(),
      vueJsx(),
      VietHtmlPlugin({
        filename:"index.html",
        entry:"src/index",
        rootDir,
        baseDir:''
      })
    ],
    css:{
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      },
    },
    optimizeDeps: {
      entries: [ 'src/index.*' ]
    },

  }
}
