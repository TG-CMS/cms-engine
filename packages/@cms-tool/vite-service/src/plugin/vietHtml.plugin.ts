import  { ViteDevServer, Plugin,transformWithEsbuild } from 'vite';
import {formatPath} from '@tgcms/util';
import * as fs from 'fs-extra';
import { template as templateComplier, set } from 'lodash';
import * as path from "path";

interface VietHtmlPluginOption{
  // 文件名称
  filename: string
  baseDir: string
  entry: string
  rootDir: string
}
export function VietHtmlPlugin({filename,baseDir,rootDir,entry}:VietHtmlPluginOption){
  const absoluteHtmlPath= formatPath(path.join(baseDir,'public', filename));
  let html = fs.readFileSync(absoluteHtmlPath, 'utf-8');
  let demo = `
  import {createApp} from 'vue';
  //@ts-ignore
  import App  from '@/index';
  const app = createApp(App);
  app.mount("#app");
  `;
  fs.ensureDirSync(path.join(rootDir,'.cms'));
  fs.writeFileSync(path.join(rootDir,'.cms','main.ts'),demo);
  const template=templateComplier(html)({entry});
  const pageName = filename.replace('.html', '');
  const plugin: Plugin = {
    name: `vite-plugin-html${pageName}`,
    enforce: 'pre',
    config(cfg) {
       cfg.build = set(cfg.build, `rollupOptions.input.${pageName}`, absoluteHtmlPath);
    },
    resolveId(id) {
      if (id.includes('.html')) {
        return formatPath(id);
      }
      return null;
    },
    load(id) {
      if (formatPath(id) === absoluteHtmlPath) {
        return template;
      }
      return null;
    },
    configureServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.endsWith('.html') && req.url !== '/') {
            return next();
          }

          if (req.url === `/${filename}`) {
            try {
              res.setHeader('Content-Type','text/html');
              res.end(await server.transformIndexHtml(req.url, template));
            } catch (e) {
              return next(e);
            }
          }

          next();
        });
      };
    }
  }
  return plugin;
}
