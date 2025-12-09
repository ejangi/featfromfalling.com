import gulp from "gulp";
import mustache from "gulp-mustache";
import gulpSass from "gulp-sass";
import * as sassCompiler from "sass";
import concat from "gulp-concat";
import sourcemaps from "gulp-sourcemaps";
import browserSync from "browser-sync";

import { deleteAsync } from "del";
import rename from "gulp-rename";
import rev from "gulp-rev";
import revReplace from "gulp-rev-replace";

// Configure gulp-sass with the sass compiler
const sass = gulpSass(sassCompiler);

const { reload } = browserSync;

function html() {
  return gulp
    .src("./src/*.mustache")
    .pipe(mustache("./src/site.json", {}, {}))
    .pipe(
      rename(function (path) {
        path.extname = ".html";
      }),
    )
    .pipe(gulp.dest("./dist"));
}

function styles() {
  return gulp
    .src("./src/styles/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(
      sass({ outputStyle: "compressed", sourcemap: true }).on(
        "error",
        sass.logError,
      ),
    )
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist/styles"));
}

function scripts() {
  return gulp
    .src("./src/scripts/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("main.js"))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist/scripts"));
}

function images() {
  return gulp
    .src("./src/images/**/*", { encoding: false })
    .pipe(gulp.dest("./dist/images"));
}

function cname() {
  return gulp.src("./src/CNAME").pipe(gulp.dest("./dist"));
}

function revision() {
  return gulp
    .src(["./dist/**/*.css", "./dist/**/*.js"])
    .pipe(rev())
    .pipe(gulp.dest("./dist"))
    .pipe(rev.manifest())
    .pipe(gulp.dest("./dist"));
}

function revreplace() {
  var manifest = gulp.src("./dist/rev-manifest.json");

  return gulp
    .src("./dist/index.html")
    .pipe(revReplace({ manifest: manifest }))
    .pipe(gulp.dest("./dist"));
}

function clean() {
  return deleteAsync(["./dist"]);
}

function watchTask() {
  browserSync({
    server: "./dist",
    open: false,
  });

  gulp.watch(["./src/**/*"], build);
  gulp.watch("./dist/*.html").on("change", browserSync.reload);
}

// Build task: clean, then parallel tasks, then revision tasks in series
const build = gulp.series(
  clean,
  gulp.parallel(images, styles, scripts, html, cname),
  revision,
  revreplace,
);

// Watch task with build
const watch = gulp.series(build, watchTask);

// Default task
const defaultTask = build;

// Export tasks
export {
  html,
  styles,
  scripts,
  images,
  cname,
  revision,
  revreplace,
  clean,
  watch,
  build,
};
export default defaultTask;

// TO DEPLOY
// python ghp-import.py -p ./dist/
