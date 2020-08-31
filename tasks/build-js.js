/**
 * Build js
 */
'use strict';

const webpack = require('webpack');
const path = require('path');

const notifier = require('../helpers/notifier');
const global = require('../gulp-config.js');

module.exports = function () {
  const production = global.isProduction();

  return (done) => {
    try {
      const config = {
        mode: 'none',
        entry: {
          [global.file.mainJs]: `./${global.folder.src}/index.js`,
        },
        output: {
          path: path.resolve(global.folder.build, ''),
          filename: `[name].js`,
        },
        optimization: {
          minimize: false,
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules)/,
              use: {
                loader: 'babel-loader',
              }
            }
          ]
        },
      };

      webpack(config, (error, stats) => {
        if (production) {
          console.log(
            stats.toString({
              version: false,
              hash: false,
              chunks: false,
              colors: true,
            })
          );
        }

        if (stats) {
          return done();
        }

        if (error) {
          throw new Error(error);
        }
      });
    } catch (error) {
      notifier.error(error, 'JS compiling error', done);
    }
  };
};
