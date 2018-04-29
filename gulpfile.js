'use strict';

var gulp        =   require('gulp');
var mustache    =   require("gulp-mustache");
var sass        =   require('gulp-sass');
var concat      =   require('gulp-concat');
var sourcemaps  =   require('gulp-sourcemaps');
var browserSync =   require('browser-sync');
var reload      =   browserSync.reload;
var imagemin    =   require('gulp-imagemin');
var runSequence =   require('run-sequence');
var del         =   require('del');
var rename      =   require("gulp-rename");

gulp.task('mustache', function () {
    return gulp.src("./src/*.mustache")
        .pipe(mustache('./src/site.json',{},{}))
        .pipe(rename(function (path) {
            path.extname = ".html"
        }))
        .pipe(gulp.dest("./dist"));
});

gulp.task('sass', function () {
    return gulp.src('./src/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('javascript', function() {
    return gulp.src('./src/scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('images', function() {
  return gulp.src('./src/images/**/*')
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeUnknownsAndDefaults: false}]
    }))
    .pipe(gulp.dest('./dist/images'));
});

gulp.task('watch', function() {
    browserSync({
        server: './dist',
        open: false
    });
    gulp.watch(['./src/styles/**/*'], ['sass']);
    gulp.watch(['./src/scripts/**/*'], ['jshint', 'scripts']);
    // gulp.watch(['./src/fonts/**/*'], ['fonts']);
    gulp.watch(['./src/images/**/*'], ['images']);
    gulp.watch(['./src/**/*.mustache', './src/site.json'], ['mustache']);
});

gulp.task('clean', require('del').bind(null, ['./dist']));

gulp.task('build', function(callback) {
  runSequence(['images', 'sass', 'javascript'],
              'mustache',
              callback);
});

gulp.task('default', function(callback) {
  runSequence('clean',
              ['images', 'sass', 'javascript'],
              'mustache',
              callback);
});