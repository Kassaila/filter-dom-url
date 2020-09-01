/**
 * Build js
 */
'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
const rename = require('gulp-rename');

const notifier = require('../helpers/notifier');
const global = require('../gulp-config.js');

module.exports = function () {
  return (done) => {
    return gulp.src(`./${global.folder.src}/index.js`)
      .pipe(babel())
      .on('error', (error) => notifier.error(error.message, 'Main JS compiling error', done))
      .pipe(rename(`${global.file.mainJs}.js`))
      .pipe(gulp.dest(`./${global.folder.build}`))
      .pipe(babel({
        presets: ['minify'],
      }))
      .pipe(rename(`${global.file.mainJsMin}.js`))
      .pipe(gulp.dest(`./${global.folder.build}`));
  };
};
