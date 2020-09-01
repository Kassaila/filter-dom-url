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
      .pipe(rename(`${global.file.mainJsMin}.js`))
      .pipe(gulp.dest(`./${global.folder.build}`));
  };
};

// const webpack = require('webpack');
// const path = require('path');

// const notifier = require('../helpers/notifier');
// const global = require('../gulp-config.js');

// module.exports = function () {
//   const production = global.isProduction();

//   return (done) => {
//     try {
//       const config = {
//         mode: 'none',
//         entry: {
//           [global.file.mainJs]: `./${global.folder.src}/index.js`,
//         },
//         output: {
//           path: path.resolve(global.folder.build, ''),
//           filename: `[name].js`,
//         },
//         optimization: {
//           minimize: false,
//         },
//         module: {
//           rules: [
//             {
//               test: /\.m?js$/,
//               exclude: /(node_modules)/,
//               use: {
//                 loader: 'babel-loader',
//               }
//             }
//           ]
//         },
//       };

//       webpack(config, (error, stats) => {
//         if (production) {
//           console.log(
//             stats.toString({
//               version: false,
//               hash: false,
//               chunks: false,
//               colors: true,
//             })
//           );
//         }

//         if (stats) {
//           return done();
//         }

//         if (error) {
//           throw new Error(error);
//         }
//       });
//     } catch (error) {
//       notifier.error(error, 'JS compiling error', done);
//     }
//   };
// };
