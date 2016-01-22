'use strict';

let OutriggerTester = require('./lib/outrigger-tester');
let path = require('path');

const TEST_TIMEOUT = 10000;

describe('demo-app', function() {
    this.timeout(TEST_TIMEOUT);
    let outriggerTester;

    before((done) => {
        outriggerTester = new OutriggerTester();
        outriggerTester.start(done);
    });

    after(() => {
        outriggerTester.stop();
    });

    it('shows errors for a program that produces an error', () => {
        return outriggerTester.run({
            path: path.join(__dirname, 'juttle', 'no-such-sub.juttle')
        })
        .then(() => {
            return outriggerTester.waitForJuttleErrorToEqual('At line 1, column 1: Error: no such sub: kaboom');
        });
    });

    it('shows warnings for program that produces a warning', () => {
        return outriggerTester.run({
            path: path.join(__dirname, 'juttle', 'warning.juttle')
        })
        .then(() => {
            return outriggerTester.waitForJuttleErrorToContain('Invalid operand types for "+": number (0) and date (2014-01-01T00:00:00.000Z)');
        });
    });

    it('can open juttle program with no inputs', () => {
        return outriggerTester.run({
            path: path.join(__dirname, 'juttle', 'no-inputs.juttle')
        })
        .then(() => {
            return outriggerTester.waitForTextOutputToContain('output',[
                { time: '1970-01-01T00:00:00.000Z', value: 10 },
                { time: '1970-01-01T00:00:00.100Z', value: 10 },
                { time: '1970-01-01T00:00:00.200Z', value: 10 }
            ]);
        });
    });

    it('can open juttle program with an input, fill it out, and run', () => {
        return outriggerTester.run({
            path: path.join(__dirname, 'juttle', 'one-input.juttle')
        })
        .then(() => {
            return outriggerTester.writeIntoInputControl('a', 'AAA');
        })
        .then(() => {
            outriggerTester.clickPlay();
        })
        .then(() => {
            return outriggerTester.waitForTextOutputToContain('output',[
                { time: '1970-01-01T00:00:00.000Z', value: 'AAA' },
                { time: '1970-01-01T00:00:00.100Z', value: 'AAA' },
                { time: '1970-01-01T00:00:00.200Z', value: 'AAA' }
            ]);
        });
    });

});
