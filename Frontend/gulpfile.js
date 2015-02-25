/* Variables: */
var     documentRoot = "../web/";
var     assetsDirectory = documentRoot + "assets/";
var     productionDefualtEnviorment = true;

/* Gulp Requirements */
var     gulp = require('gulp'),
        gutil = require('gulp-util'),
        uglify = require('gulp-uglify'),
        bower = require('bower'),
        concat = require('gulp-concat'),
        sourcemaps = require ('gulp-sourcemaps'),
        gulpif = require('gulp-if'),
        livereload = require('gulp-livereload'),
        plumber = require('gulp-plumber')
        sass = require('gulp-sass'),
        csso = require('gulp-csso'),
        autoprefixer = require('gulp-autoprefixer'),
        sh = require('shelljs');

/* Executable tasks */
gulp.task('default', function() {
    gulp.start('head-js');
    gulp.start('body-js');
    gulp.start('sass');
});

gulp.task('dev', function() {
    productionDefualtEnviorment = false;
    gulp.start('default');
});

gulp.task('watch', function() {
    productionDefualtEnviorment = false;
    livereload.listen();
    gulp.watch(['./javascript/*.js', './bower_components/*.js'], ['head-js','body-js']);
    gulp.watch(['./scss/**/*.scss', './bower_components/**/*.scss'],['sass']);
});

/* Stylesheet compilation */
gulp.task('sass', function () {
    gulp.src('scss/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass(
            { includePaths : ['scss/'] 
            }
        ))
        .pipe(autoprefixer({
            browsers: ['> 5% in NL'],
            cascade: true,
            remove: true
        }))
        .pipe(gulpif(productionDefualtEnviorment, csso(), sourcemaps.write('../maps')))
        .pipe(gulp.dest(assetsDirectory + 'css/'))
        .pipe(livereload());
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

gulp.task('install', ['bin-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('bin-check', function(done) {
  if (!sh.which('git')) {
    console.log('  ' + gutil.colors.red('Git is not installed.'));
    process.exit(1);
  }
  if (!sh.which('svn')) {
    console.log('  ' + gutil.colors.red('Subversion is not installed.'));
    process.exit(1);
  }
  done();
});
