'use strict';

const gulp = require('gulp');

const global = require('./gulp-config.js');

const cleanBuild = require('./tasks/clean-build');
const lintJs = require('./tasks/lint-js');
const buildJs = require('./tasks/build-js');
const watch = require('./tasks/watch');

/**
 * Clean build folders
 */
gulp.task(global.task.cleanBuild, cleanBuild());

/**
 * Lint JS
 */
gulp.task(global.task.lintJs, lintJs());

/**
 * Fix JS files
 */
gulp.task(global.task.fixJs, lintJs());

/**
 * Build JS
 */
gulp.task(global.task.buildJs, buildJs());

/**
 * Watch for file changes
 */
gulp.task(global.task.watch, watch());

/**
 * Develop mode - with watch
 */
gulp.task('default', gulp.series(
  global.task.cleanBuild,
  global.task.lintJs,
  global.task.buildJs,
  global.task.watch,
));

/**
 * Build mode
 */
gulp.task(global.task.build, gulp.series(
  global.task.cleanBuild,
  global.task.lintJs,
  global.task.buildJs,
));
