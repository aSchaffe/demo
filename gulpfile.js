var gulp = require('gulp');
var changed = require('gulp-changed'),
    jshint = require ('gulp-jshint'),
    concat = require ('gulp-concat'),
    uglify = require ('gulp-uglify'),
    rename = require('gulp-rename'),
    imagemin = require ('gulp-imagemin'),
    clean = require('gulp-clean'),
    minifyhtml = require ('gulp-minify-html'),
    autoprefixer = require ('gulp-autoprefixer'),
    minifyCSS = require ('gulp-minify-css');

gulp.task('images', function() {
    var imgSrc = 'files/img/**/*',
        imgDst = 'files/img';

    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});

gulp.task('js', function() {
    return gulp.src(['gulpfile.js', 'assets/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function () {
    watcherJS.on('changed', function (event) {
        console.log('File ' + event.path + ' was ' + event.type +
            ', running tasks...');
    });
});