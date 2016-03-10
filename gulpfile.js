var gulp = require('gulp');
var isparta = require('isparta');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

// required to run gulp-mocha on babel code
require('babel-core/register');

gulp.task('instrument', function () {
    return gulp.src([
        'src/**/*.js',
        '!src/apps/index.js'
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
        require: ['./test/setup.js'],
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
            statements: 87,
            branches: 87,
            functions: 85,
            lines: 62
        }
    };

    return gulp_test()
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({
        thresholds: coverage
    }));
});

gulp.task('default', ['test']);
