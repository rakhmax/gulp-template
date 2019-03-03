const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
// const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const htmlPartial = require('gulp-html-partial');

const isProd = process.env.NODE_ENV === 'prod';

function html() {
    return gulp.src('src/index.html')
        .pipe(htmlPartial({ basePath: 'src/components/' }))
        .pipe(gulpIf(isProd, htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest('dist'));  
}

function css() {
    return gulp.src('src/assets/sass/style.scss')
        .pipe(gulpIf(!isProd, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpIf(!isProd, sourcemaps.write()))
        .pipe(gulpIf(isProd, cssmin()))
        .pipe(gulp.dest('dist/css/'));
}

function js() {
    return gulp.src('src/components/*/*.js')
        // .pipe(babel({
        //     presets: ['@babel/env']
        // }))
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'));
}

function serve() {
    browserSync.init({
        open: false,
        server: './dist',
        port: 3000
    });
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}

function watchFiles() {
    gulp.watch('src/**/*.html', gulp.series(html, browserSyncReload));
    gulp.watch('src/**/*.scss', gulp.series(css, browserSyncReload));
    gulp.watch('src/**/*.js', gulp.series(js, browserSyncReload));

    return;
}

exports.css = css;
exports.html = html;
exports.js = js;
exports.serve = gulp.parallel(html, css, js, watchFiles, serve);
exports.default = gulp.parallel(html, css, js);