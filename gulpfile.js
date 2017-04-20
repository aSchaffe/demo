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
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer');


gulp.task('js', function () {
    return gulp.src(['gulpfile.js', 'assets/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('less', function(){
    return gulp.src('assets/less/styles.less')
        .pipe(less().on('error', function ( err ) {
            gutil.log(err);
            this.emit('end');
        }))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browserSync', function() {
    browserSync.init({
        proxy: 'http://localhost'
    });
});

gulp.task('watch', ['browserSync' , 'less'], function(){
    gulp.watch('assets/less/**/*.less', ['less']);
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('assets/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['less']);
gulp.task('default', ['build']);