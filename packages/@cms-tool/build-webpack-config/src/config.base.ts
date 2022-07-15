import * as Config from 'webpack-chain';
export default (config:Config) => {
  config.resolve.extensions
    .merge(['.js', '.json', '.jsx', '.ts', '.tsx', '.mjs', '.mts']);
};
