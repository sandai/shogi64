"use strict";

var fs = require('fs'),
    webpack = require('webpack');

var pkg = JSON.parse(fs.readFileSync('./package.json'));

var libraryName = 'shogi64';

var version = pkg.version;

var banner = '/**\n' +
      ' * ' + libraryName + '.js v' + version + '\n' +
      ' *\n' +
      ' * Copyright (c) ' + new Date().getFullYear() + ' ' + pkg.author + '\n' +
      ' * Released under the MIT license\n' +
      ' */\n\n';

var dest = './build';

module.exports = {
  banner: banner,

  dest: dest,

  build: {
    min: {
      src: './lib/main.js',
      webpack: {
        plugins: [
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false
            }
          })],
        output: {
          library: libraryName,
          libraryTarget: 'var',
          filename: libraryName + '-' + version + '.min.js'
        }
      }
    },
    dev: {
      strip: {
        header: "\\n*?\\/\\* ---------- header ---------- \\*\\/[\\s\\S]*?\\/\\* ---------- header ---------- \\*\\/\\n*",
        exports: "\\n*?\\/\\* ---------- exports ---------- \\*\\/[\\s\\S]*?\\/\\* ---------- exports ---------- \\*\\/\\n*"
      },
      filename: libraryName + '-' + version + '.dev.js',
      src: [
        './lib/p.prefix',
        './lib/main.js',
        './lib/e.exports',
        './lib/s.suffix'
      ]
    }
  },

  jshint: {
    src: './lib/**/*.js',
    test: './test/*.test.js'
  }
};
