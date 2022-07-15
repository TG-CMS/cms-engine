import * as Config from 'webpack-chain';
//import { Configuration as WebpackOptions } from 'webpack';
export interface ProjectOptions {
  devServer?: { proxy: string | object, [key: string]: any };
  chainWebpack?: (config: Config) => void;
  plugin:[],
}
export const defaultPostcssConfig={
  plugins: [
    ['postcss-nested'],
    ['postcss-preset-env', {
      // Without any configuration options, PostCSS Preset Env enables Stage 2 features.
      stage: 3,
      browsers: [
        'last 2 versions',
        'Firefox ESR',
        '> 1%',
        'ie >= 9',
        'iOS >= 8',
        'Android >= 4',
      ],
    }],
  ],
};

export function getPostcssConfig(){
  return {
    ...defaultPostcssConfig,
    plugins: defaultPostcssConfig.plugins?.map(([pluginName, pluginOptions]: [string, any]) => {
      return require(pluginName)(pluginOptions);
    }),
  }
}

