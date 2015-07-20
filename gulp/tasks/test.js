"use strict";

var gulp = require('gulp'),
    Server = require('karma').Server,
    config = require('../config').test,
    jasmine = require('gulp-jasmine'),
    runSequence = require('run-sequence'),
    path = require('path');


gulp.task('test', function() {
  runSequence('test:browser');
});

gulp.task('test:browser', ['jshint:test'], function (done) {
  new Server({
    configFile: path.resolve('karma.conf.js'),
    browsers: ['PhantomJS'],
    reporters: ['progress'],
    singleRun: true
  }, done).start();
});
