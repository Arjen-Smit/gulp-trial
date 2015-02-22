/* Variables: */
var     documentRoot = "../web/";
var     assetsDirectory = documentRoot + "assets/";
var     productionDefualtEnviorment = true;

/* Gulp Requirements */
var     gulp = require('gulp'),
        uglify = require('gulp-uglify'),
        concat = require('gulp-concat'),
        sourcemaps = require ('gulp-sourcemaps'),
        gulpif = require('gulp-if'),
        livereload = require('gulp-livereload');

/* Executable tasks */
gulp.task('default', function() {
    gulp.start('head-js');
    gulp.start('body-js');
});

gulp.task('dev', function() {
    productionDefualtEnviorment = false;
    gulp.start('head-js');
    gulp.start('body-js');
});

gulp.task('watch', function() {
    productionDefualtEnviorment = false;
    livereload.listen();
    gulp.watch(['./javascript/*.js', './bower_components/*.js'], ['head-js','body-js']);
    
});

/* Javascript generation for head.min.js */
gulp.task('head-js', function() {
    gulp.src([
        "javascript/head.js"
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('head.js'))
    .pipe(gulpif(productionDefualtEnviorment, uglify(), sourcemaps.write('../maps')))
    .pipe(gulp.dest(assetsDirectory + 'javascript/'))
    .pipe(livereload());
    
});

/* Javascript generation for body.min.js */
gulp.task('body-js', function() {
    gulp.src([
        "bower_components/jquery/dist/jquery.js",
        "javascript/body.js"
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('body.js'))
    .pipe(gulpif(productionDefualtEnviorment, uglify(), sourcemaps.write('../maps')))
    .pipe(gulp.dest(assetsDirectory + 'javascript/'))
    .pipe(livereload());;
});
