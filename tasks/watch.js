/**
 * Watch for file changes
 */
'use strict';

const gulp = require('gulp');

const global = require('../gulp-config.js');

module.exports = function () {

  return () => {
    gulp.watch(`./${global.folder.src}/**/*.js`, gulp.series(global.task.lintJs, global.task.buildJs));
  };
};
