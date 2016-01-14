var gulp = require('gulp');
var isparta = require('isparta');
var istanbul = require('gulp-istanbul');
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
        'bin/outrigger-client',
        'bin/outriggerd',
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
        'bin/outrigger-client',
        'bin/outriggerd',
        'lib/**/*.js',
    ])
    .pipe(jshint('./lib/.jshintrc'))
    .pipe(jshint.reporter('default', { verbose: true }))
    .pipe(jshint.reporter('fail'));
});

gulp.task('lint', ['jscs-lib', 'jscs-test', 'jshint-lib', 'jshint-test']);

gulp.task('instrument', function () {
    return gulp.src([
        'lib/**/*.js',
        '!lib/juttle-subprocess.js',
        'src/**/*.js'
    ])
    .pipe(istanbul({
        includeUntested: true,
        // ES6 Instrumentation
        instrumenter: isparta.Instrumenter
    }))
    .pipe(istanbul.hookRequire());
});

function gulp_test_app() {
    return gulp.src([
    ])
    .pipe(mocha({
        log: true,
        timeout: 5000,
        reporter: 'spec',
        ui: 'bdd',
        ignoreLeaks: true,
        globals: ['should']
    }));
}

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
    return gulp_test()
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({
        thresholds: {
            global: {
                statements: 76,
                branches: 70,
                functions: 69,
                lines: 73 
            }
        }
    }));
});

gulp.task('default', ['test', 'lint']);
