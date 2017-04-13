var gulp = require('gulp');
var changed = require('gulp-changed'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    less = require('gulp-less'),
    path = require('path'),
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
        }))
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'assets'
        }
    });
});

gulp.task('watch', ['browserSync' , 'less'], function(){
    gulp.watch('assets/less/**/*.less', ['less']);
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('assets/js/**/*.js', browserSync.reload);
});

gulp.task('default', function (callback) {
    runSequence(['less','browserSync'], 'watch',
        callback
    )
});

gulp.task('build', function(callback) {
    runSequence(
        'clean:assets',
        'less',
        callback
    )
});