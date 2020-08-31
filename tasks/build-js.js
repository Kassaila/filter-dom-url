/**
 * Build js
 */
'use strict';

const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const notifier = require('../helpers/notifier');
const global = require('../gulp-config.js');

module.exports = function () {
  const production = global.isProduction();
  const mainFileName = production ? global.file.mainJsMin : global.file.mainJs;

  return (done) => {
    try {
      const config = {
        mode: 'none',
        entry: `./${global.folder.src}/index.js`,
        output: {
          path: path.resolve(global.folder.build, ''),
          filename: mainFileName,
        },
        optimization: {
          minimize: production,
          minimizer: [new TerserPlugin()],
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
