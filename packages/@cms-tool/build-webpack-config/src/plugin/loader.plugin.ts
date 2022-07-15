import * as Config from 'webpack-chain';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getBabelConfig from '@tgcms/babel-config';
import { cloneDeep } from 'lodash';
import {getPostcssConfig} from '../options'
const EXCLUDE_REGX = /node_modules/;


const configCSSRule = (config, style, loaders = []) => {
  const cssModuleReg = new RegExp(`\\.module\\.${style}$`);
  const styleReg = new RegExp(`\\.${style}$`);
  const cssLoaderOpts = {
    sourceMap: true,
  };
  const cssModuleLoaderOpts = {
    ...cssLoaderOpts,
    modules: {
      localIdentName: '[folder]--[local]--[hash:base64:7]',
    },
  };
  const postcssOpts = {
    // lock postcss version
    // eslint-disable-next-line global-require
    implementation: require('postcss'),
    postcssOptions: {
      config: false,
      // eslint-disable-next-line global-require
      ...(getPostcssConfig()),
    }
  };

  // add both rule of css and css module
  ['css', 'module'].forEach((ruleKey) => {
    let rule;
    if (ruleKey === 'module') {
      rule = config.module.rule(`${style}-module`)
        .test(cssModuleReg);
    } else {
      rule = config.module.rule(style)
        .test(styleReg)
        .exclude.add(cssModuleReg).end();
    }

    rule
      .use('MiniCssExtractPlugin.loader')
      .loader(MiniCssExtractPlugin.loader)
      // compatible with commonjs syntax: const styles = require('./index.module.less')
      .options({
        esModule: false,
      })
      .end()
      .use('css-loader')
      .loader(require.resolve('css-loader'))
      .options(ruleKey === 'module' ? cssModuleLoaderOpts : cssLoaderOpts)
      .end()
      .use('postcss-loader')
      .loader(require.resolve('postcss-loader'))
      .options({ ...cssLoaderOpts, ...postcssOpts });

    loaders.forEach((loader) => {
      const [loaderName, loaderPath, loaderOpts = {}] = loader;
      rule.use(loaderName)
        .loader(loaderPath)
        .options({ ...cssLoaderOpts, ...loaderOpts });
    });
  });
};
// config assets rules
const configAssetsRule = (config: Config, type, testReg, loaderOpts = {}) => {
  config.module.rule(type).test(testReg)
    .set('type', 'asset')
    .set('generator', {
      dataUrl: loaderOpts,
    })
    .set('parser', {
      dataUrlCondition: {
        maxSize: 8 * 1024 // 8kb
      }
    });
};
export const loaderConfig= (config:Config)=>{
  [
    ['css'],
    ['scss', [['sass-loader', require.resolve('sass-loader')]]],
    ['less', [['less-loader', require.resolve('less-loader'), { lessOptions: { javascriptEnabled: true } }]]],
  ].forEach(([style, loaders]) => {
    configCSSRule(config, style, (loaders as any) || []);
  });

  [
    ['woff2', /\.woff2?$/, { mimetype: 'application/font-woff' }],
    ['ttf', /\.ttf$/, { mimetype: 'application/octet-stream' }],
    ['eot', /\.eot$/, { mimetype: 'application/vnd.ms-fontobject' }],
    ['svg', /\.svg$/, { mimetype: 'image/svg+xml' }],
    ['img', /\.(png|jpg|webp|jpeg|gif)$/i],
  ].forEach(([type, reg, opts]) => {
    configAssetsRule(config, type, reg, opts || {});
  });
  const babelLoader = require.resolve('babel-loader');
  const babelConfig = getBabelConfig();
  ['jsx', 'tsx'].forEach(ruleName => {
    const testRegx = new RegExp(`\\.m?${ruleName}?$`);
    config.module.rule(ruleName)
      .test(testRegx)
      .exclude
      .add(EXCLUDE_REGX)
      .end()
      .use('babel-loader')
      .loader(babelLoader)
      .options({ ...cloneDeep(babelConfig) });
  });
}
