/**
 * Build html from templates
 */
'use strict';

const gulp = require('gulp');
const fileInclude = require('gulp-file-include');

const notifier = require('../helpers/notifier');
const global = require('../gulp-config.js');

module.exports = function () {
  const production = global.isProduction();
  const config = {
    prefix: '@@',
    basepath: `./${global.buildHtml.templates}`,
    indent: true,
    context: {
      min: production ? '.min' : '',
      mainJs: global.file.mainJs,
      vendorJs: global.file.vendorJs,
      mainStyles: global.file.mainStyles,
      vendorStyles: global.file.vendorStyles,
    },
  };

  return (done) => {
    return gulp.src(`./${global.buildHtml.templates}/**/*.html`)
      .pipe(fileInclude(config))
      .on('error', (error) => notifier.error(error.message, 'HTML compiling error', done))
      .pipe(gulp.dest(`./${global.folder.dev}`));
  };
};
