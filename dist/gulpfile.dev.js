"use strict";

var gulp = require('gulp');

var browserify = require('browserify');

var source = require('vinyl-source-stream');

var buffer = require('vinyl-buffer');

var babelify = require('babelify');

var sass = require('gulp-sass');

var uglify = require('gulp-uglify');

var shell = require('gulp-shell');

var del = require('del');

gulp.task('js', function (done) {
  return browserify('_source/_assets/source/js/main.js').transform(babelify, {
    presets: ['@babel/preset-env']
  }).bundle().pipe(source('app.js')) // Converts To Vinyl Stream
  .pipe(buffer()) // Converts Vinyl Stream To Vinyl Buffer
  // Gulp Plugins Here!
  //.pipe(uglify())
  .pipe(gulp.dest('_source/assets/js'));
  done();
});
gulp.task('sass', function (done) {
  gulp.src('_source/_assets/source/css/*.scss').pipe(sass({
    outputStyle: 'compressed'
  }).on('error', sass.logError)).pipe(gulp.dest('_source/assets/css'));
  done();
});
gulp.task('images', function (done) {
  gulp.src('_source/_assets/source/images/*').pipe(gulp.dest('_source/assets/images'));
  done();
});
gulp.task('fonts', function (done) {
  gulp.src('_source/_assets/source/fonts/*').pipe(gulp.dest('_source/assets/fonts'));
  done();
});
gulp.task('lib', function (done) {
  gulp.src('_source/_assets/source/js/lib/*').pipe(gulp.dest('_source/assets/js/lib'));
  done();
});
gulp.task('eleventy', shell.task('eleventy'));
gulp.task('clean:postbuild', function () {
  return del(['_source/assets/**/*']);
});
gulp.task('watch', function () {
  gulp.watch('_source/_assets/**/*', gulp.series('default'));
  gulp.watch('_source/_includes/**/*', gulp.series('default'));
  gulp.watch('_source/posts/**/*', gulp.series('default'));
});
gulp.task('default', gulp.series('js', 'lib', 'sass', 'images', 'fonts', 'eleventy', 'clean:postbuild'));
gulp.task('build', gulp.series('default', 'watch'));