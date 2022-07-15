
/**
 * babel config
 */
export function resolvePlugin(plugins) {
  return plugins.filter(Boolean).map((plugin) => {
    if (Array.isArray(plugin)) {
      const [pluginName, ...args] = plugin;
      return [require.resolve(pluginName), ...args];
    }
    return require.resolve(plugin);
  });
}
export interface babelOption {
  typescript?: boolean;
  env?: object;
  react?: boolean | object;
  vue?:boolean
}

export function getPreset(opts: babelOption = {}) {
  const plugins = [
    // Stage 0
    '@babel/plugin-proposal-function-bind',
    // Stage 1
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-logical-assignment-operators',
    ['@babel/plugin-proposal-optional-chaining', { loose: false }],
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: false }],
    '@babel/plugin-proposal-do-expressions',
    // Stage 2
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    // Stage 3
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    // Note:
    // 'loose' mode configuration must be the same for
    // - @babel/plugin-proposal-class-properties
    // - @babel/plugin-proposal-private-methods
    // - @babel/plugin-proposal-private-property-in-object
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    '@babel/plugin-proposal-json-strings',
    opts.vue&&[
      "@vue/babel-plugin-jsx",
      { mergeProps: false, enableObjectSlots: false },
    ],
    opts.vue&&[
      "@babel/plugin-transform-typescript",
      {
        isTSX: true,
      },
    ]
  ];

  return {
    presets: resolvePlugin([
      opts.env && [
        '@babel/preset-env', opts.env,
      ],
      opts.typescript && '@babel/preset-typescript',
      opts.react && (typeof opts.react === 'boolean'
          ? '@babel/preset-react'
          : ['@babel/preset-react', opts.react]
      ),
    ]),
    plugins: resolvePlugin(plugins),
  };
};
