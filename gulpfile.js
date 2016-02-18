var gulp = require('gulp');
var copy = require('gulp-copy');

var PATHS = {
    src: 'src/**/*.ts'
};

gulp.task('clean', function (done) {
    var del = require('del');
    del(['dist'], done);
});

gulp.task('ts2js', function () {
    var typescript = require('gulp-typescript');
    var tscConfig = require('./tsconfig.json');

    var tsResult = gulp
        .src(PATHS.src)
        .pipe(typescript(tscConfig.compilerOptions));

    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('copyTs', function () {
    return gulp
        .src(PATHS.src)
        .pipe(copy('./dist', {
            prefix: 1
        }));
});

gulp.task('replaceExport', ['clean', 'ts2js'], function(){
    return gulp.src(['export.js'])
        .pipe(replace('src/', 'dist/'))
        .pipe(gulp.dest('.'));
});

gulp.task('watch', ['ts2js', 'copyTs'], function () {
    gulp.watch(PATHS.src, ['ts2js', 'copyTs']);
});

gulp.task('default', ['ts2js', 'copyTs']);
