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
        'bin/outrigger-client',
        'bin/outriggerd',
        'lib/**/*.js',
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
        'lib/**/*.js',
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
    var argv = require('minimist')(process.argv.slice(2));
    var tests = [
        'test/**/*.spec.js'
    ];

    // by passing the argument `--app` you can also run the app tests
    // which require spinning up a browser, by default we do not run
    // the app tests
    if (!argv.app) {
        tests.push(
            // exclude app tests
            '!test/app/**/*.spec.js'
        );
    }

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
    var argv = require('minimist')(process.argv.slice(2));
    var coverage;

    // different coverage numbers when running with and without app tests
    if (argv.app) {
        coverage = {
            global: {
                statements: 84,
                branches: 80,
                functions: 82,
                lines: 82
            }
        };
    } else {
        coverage = {
            global: {
                statements: 84,
                branches: 79,
                functions: 81,
                lines: 82
            }
        }
    }

    return gulp_test()
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({
        thresholds: coverage
    }));
});

gulp.task('default', ['test', 'lint']);
