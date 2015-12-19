// XXX/mstemm todo
//  - Add code coverage
//  - Add linting
//  - Add style guide checking

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var jscs = require('gulp-jscs');

gulp.task('jscs-test', function() {
    return gulp.src([
        'test/**/*.spec.js',
    ])
    .pipe(jscs({
        configPath: '.jscsrc'
    }))
    .pipe(jscs.reporter('unix'))
    .pipe(jscs.reporter('fail'));
});

gulp.task('jscs-lib', function() {
    return gulp.src([
        'bin/demo',
        'bin/client',
        'lib/*.js'
    ])
    .pipe(jscs({
        configPath: '.jscsrc'
    }))
    .pipe(jscs.reporter('unix'))
    .pipe(jscs.reporter('fail'));
});

gulp.task('jshint-test', function() {
    return gulp.src([
        'test/**/*.spec.js',
    ])
    .pipe(jshint('./test/.jshintrc'))
    .pipe(jshint.reporter('default', { verbose: true }))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jshint-lib', function() {
    return gulp.src([
        'bin/demo',
        'bin/client',
        'lib/**/*.js',
    ])
    .pipe(jshint('./lib/.jshintrc'))
    .pipe(jshint.reporter('default', { verbose: true }))
    .pipe(jshint.reporter('fail'));
});

gulp.task('lint', ['jscs-lib', 'jscs-test', 'jshint-lib', 'jshint-test']);

function gulp_test() {
    return gulp.src('test/**/*.spec.js')
        .pipe(mocha({
            log: true,
            timeout: 5000,
            reporter: 'spec',
            ui: 'bdd',
            ignoreLeaks: true,
            globals: ['should']
        }));
}

gulp.task('test', function() {
    return gulp_test();
});

gulp.task('default', ['test', 'lint']);
