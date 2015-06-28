"use strict";

var gulp = require('gulp'),
    karma = require('gulp-karma'),
    jasmine = require('gulp-jasmine'),
    runSequence = require('run-sequence'),
    config = require('../config').test;

gulp.task('test', function() {
  runSequence('test:browser');
});

gulp.task('test:browser', ['jshint:test'], function () {
  return gulp.src(config.browser.src)
    .pipe(karma({
      configFile: config.browser.options.configFile,
      browsers: ['PhantomJS'],
      reporters: ['progress'],
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});
