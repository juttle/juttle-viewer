'use strict';

let OutriggerTester = require('./lib/outrigger-tester');
let path = require('path');

const TEST_TIMEOUT = 30000;

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

    it('open juttle program with no inputs', () => {
        return outriggerTester.run({
            path: path.join(__dirname, 'juttle', 'no-inputs.juttle')
        })
        .then(() => {
            return outriggerTester.waitForTextOutputToContain('output',[
                { time: '1970-01-01T00:00:00.000Z', value: 10 },
                { time: '1970-01-01T00:00:01.000Z', value: 10 },
                { time: '1970-01-01T00:00:02.000Z', value: 10 }
            ]);
        });
    });

    it('open juttle program with an input, fill it out, and run', () => {
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
                { time: '1970-01-01T00:00:01.000Z', value: 'AAA' },
                { time: '1970-01-01T00:00:02.000Z', value: 'AAA' }
            ]);
        });
    });

});
