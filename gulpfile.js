var gulp = require('gulp');
var changed = require('gulp-changed'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    less = require('gulp-less'),
    path = require('path'),
    watch = require('gulp-watch'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyhtml = require('gulp-minify-html'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css');


gulp.task('js', function () {
    return gulp.src(['gulpfile.js', 'assets/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});