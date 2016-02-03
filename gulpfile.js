var eslint = require('gulp-eslint');
var gulp = require('gulp');
var isparta = require('isparta');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

gulp.task('lint-test', function() {
    return gulp.src([
        'test/**/*.spec.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint-lib', function() {
    return gulp.src([
        'src/**/*.js',
        'gulpfile.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint', ['lint-lib', 'lint-test']);

gulp.task('instrument', function () {
    return gulp.src([
        'src/**/*.js'
    ])
    .pipe(istanbul({
        includeUntested: true,
        // ES6 Instrumentation
        instrumenter: isparta.Instrumenter
    }))
    .pipe(istanbul.hookRequire());
});

function gulp_test() {
    var tests = [
        'test/**/*.spec.js'
    ];

    return gulp.src(tests)
    .pipe(mocha({
        log: true,
        timeout: 30000,
        reporter: 'spec',
        ui: 'bdd',
        ignoreLeaks: true,
        globals: ['should']
    }));
}

gulp.task('test', function() {
    return gulp_test();
});

gulp.task('test-coverage', ['instrument'], function() {
    var coverage = {
        global: {
            statements: 84,
            branches: 80,
            functions: 82,
            lines: 82
        }
    };

    return gulp_test()
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({
        thresholds: coverage
    }));
});

gulp.task('default', ['test', 'lint']);
