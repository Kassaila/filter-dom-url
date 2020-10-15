/**
 * Lint ES
 */
'use strict';

const ESLint = require('eslint').ESLint;

const global = require('../gulp-config.js');

module.exports = function () {
  const fixJs = global.isFixJs();
  const eslint = new ESLint({
    fix: fixJs,
    useEslintrc: true,
  });

  return async (done) => {
    const results = await eslint.lintFiles([`./${global.folder.src}/**/*.js`]);

    if (fixJs) await ESLint.outputFixes(results);

    const formatter = await eslint.loadFormatter('stylish');
    const resultText = formatter.format(results);

    if (resultText !== '') console.log(resultText);

    return done();
  };
};
