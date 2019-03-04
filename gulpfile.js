const gulp          = require('gulp');
const gulpIf        = require('gulp-if');
const browserSync   = require('browser-sync').create();
const sass          = require('gulp-sass');
const htmlmin       = require('gulp-htmlmin');
const cssmin        = require('gulp-cssmin');
const uglify        = require('gulp-uglify');
const imagemin      = require('gulp-imagemin');
const concat        = require('gulp-concat');
const jsImport      = require('gulp-js-import');
const sourcemaps    = require('gulp-sourcemaps');
const htmlPartial   = require('gulp-html-partial');

const isProd = process.env.NODE_ENV === 'prod';

function html() {
    return gulp.src('src/index.html')
        .pipe(htmlPartial({ basePath: 'src/partials/' }))
        .pipe(gulpIf(isProd, htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest('dist'));  
}

function css() {
    return gulp.src('src/sass/style.scss')
        .pipe(gulpIf(!isProd, sourcemaps.init()))
        .pipe(sass({ includePaths: ['node_modules'] }).on('error', sass.logError))
        .pipe(gulpIf(!isProd, sourcemaps.write()))
        .pipe(gulpIf(isProd, cssmin()))
        .pipe(gulp.dest('dist/css/'));
}

function js() {
    return gulp.src('src/js/*.js')
        .pipe(jsImport({hideConsole: true}))
        .pipe(concat('all.js'))
        .pipe(gulpIf(isProd, uglify()))
        .pipe(gulp.dest('dist/js'));
}

function img() {
    return gulp.src('src/img/*')
        .pipe(gulpIf(isProd, imagemin()))
        .pipe(gulp.dest('dist/img/'));
}

function serve() {
    browserSync.init({
        open: false,
        server: './dist'
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
    gulp.watch('src/assets/img/**/*.*', gulp.series(img));

    return;
}

exports.css = css;
exports.html = html;
exports.js = js;
exports.serve = gulp.parallel(html, css, js, img, watchFiles, serve);
exports.default = gulp.parallel(html, css, js, img);