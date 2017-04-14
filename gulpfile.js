var gulp = require('gulp');
var changed = require('gulp-changed'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    less = require('gulp-less'),
    browserSync = require('browser-sync').create(),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence'),
    autoprefixer = require('gulp-autoprefixer');


gulp.task('js', function () {
    return gulp.src(['gulpfile.js', 'assets/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('less', function(){
    return gulp.src('assets/less/styles.less')
        .pipe(less())
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browserSync', function() {
    browserSync.init({
        proxy: 'http://192.168.0.9:8888'
    });
});

gulp.task('watch', ['browserSync' , 'less'], function(){
    gulp.watch('assets/less/**/*.less', ['less']);
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('assets/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['less']);
gulp.task('default', ['build']);