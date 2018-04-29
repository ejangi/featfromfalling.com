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
var rev         =   require('gulp-rev');
var revReplace  =   require('gulp-rev-replace');

gulp.task('html', function () {
    return gulp.src("./src/*.mustache")
        .pipe(mustache('./src/site.json',{},{}))
        .pipe(rename(function (path) {
            path.extname = ".html"
        }))
        .pipe(gulp.dest("./dist"));
});

gulp.task('styles', function () {
    return gulp.src('./src/styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed', sourcemap: true, }).on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('scripts', function() {
    return gulp.src('./src/scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('./'))
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

gulp.task('cname', function () {
    return gulp.src('./src/CNAME')
        .pipe(gulp.dest('./dist'));
});

gulp.task("revision", ["styles", "scripts"], function(){
  return gulp.src(["./dist/**/*.css", "./dist/**/*.js"])
    .pipe(rev())
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist'))
})
 
gulp.task("revreplace", ["revision"], function(){
  var manifest = gulp.src("./dist/rev-manifest.json");
 
  return gulp.src("./dist/index.html")
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    browserSync({
        server: './dist',
        open: false
    });
    gulp.watch(['./src/**/*'], ['build']);
    gulp.watch("./dist/*.html").on('change', browserSync.reload);
});

gulp.task('clean', require('del').bind(null, ['./dist']));

gulp.task('build', function(callback) {
  runSequence('clean',
              ['images', 'html', 'cname'],
              'revreplace',
              callback);
});

gulp.task('default', function(callback) {
  runSequence('clean',
              ['images', 'html', 'cname'],
              'revreplace',
              callback);
});

// TO DEPLOY
// python ghp-import.py -p ./dist/
