module.exports = [
  {
    path: 'dist/filter-dom-url.mjs',
    limit: '4 KB',
    modifyEsbuildConfig(config) {
      config.format = 'esm';
      return config;
    },
  },
  {
    path: 'dist/filter-dom-url.js',
    limit: '4 KB',
    modifyEsbuildConfig(config) {
      config.format = 'cjs';
      return config;
    },
  },
];
