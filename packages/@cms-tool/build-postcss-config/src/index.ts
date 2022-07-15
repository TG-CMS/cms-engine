export const defaultPostcssConfig={
  plugins: [
    ['autoprefixer'],
    ['postcss-nested'],
    ['postcss-preset-env', {
      // Without any configuration options, PostCSS Preset Env enables Stage 2 features.
      stage: 3,
      browsers: [
        'last 2 versions',
        'Firefox ESR',
        '> 1%',
        'iOS >= 8',
        'Android >= 7',
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
