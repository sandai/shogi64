"use strict";

var gulp = require('gulp'),
    Server = require('karma').Server,
    path = require('path');

gulp.task('karma', ['jshint:test'], function (done) {
  new Server({
    configFile: path.resolve('karma.conf.js'),
    autoWatch: true
  }, done).start();
});
