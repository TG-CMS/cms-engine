import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import {createServer, InlineConfig, ServerOptions, ViteDevServer} from 'vite';
import {VietHtmlPlugin} from './plugin';
import * as path from "path";
export function viteConfig(context):InlineConfig{
  const {rootDir,commandArgs={}}=context;
  const tplDir=path.join(__dirname, './public');
  const baseDir=path.join(__dirname);
  const publicDir=path.join(rootDir, './public');
  const server:ServerOptions={
    port: commandArgs.port || 4003,
    host: commandArgs.host || '0.0.0.0',
    cors:true,
  }
  return {
    server,
    base:'/',
    configFile: false,
    root:rootDir,
    publicDir,
    resolve:{
        alias:{
          "@":path.join(rootDir,'src')
        }
    },
    plugins: [
      vue(),
      vueJsx(),
      VietHtmlPlugin({
        filename:"index.html",
        entry:"/.cms/main.ts",
        rootDir,
        baseDir,
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
export async function ViteService(context):Promise<ViteDevServer>{
  const server = await createServer(viteConfig(context));
  await server.listen();
  server.printUrls();
  return server;
}
