import * as Config from 'webpack-chain';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as SimpleProgressPlugin from 'webpack-simple-progress-plugin';
import * as CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
export const webpackPlugin= (config:Config)=>{
  config
    .plugin('MiniCssExtractPlugin')
    .use(MiniCssExtractPlugin, [{
      filename: '[name].css',
    }])
    .end()
    .plugin('SimpleProgressPlugin')
    .use(SimpleProgressPlugin)
    .end()
    .plugin('CaseSensitivePathsPlugin')
    .use(CaseSensitivePathsPlugin);
}
