'use strict';

let OutriggerTester = require('./lib/outrigger-tester');
let path = require('path');
let expect = require('chai').expect;

const TEST_TIMEOUT = 30000;

describe('barchart', function() {
    this.timeout(TEST_TIMEOUT);
    let outriggerTester;

    before((done) => {
        outriggerTester = new OutriggerTester();
        outriggerTester.start(done);
    });

    after(() => {
        outriggerTester.stop();
    });

    it('can render a simple barchart', () => {
        var title = 'Average CPU % per host for last 10 minutes';
        return outriggerTester.run({
            path: path.join(__dirname, 'juttle', 'simple_barchart.juttle')
        })
        .then(() => {
            return outriggerTester.waitForViewTitle(title);
        })
        .then(() => {
            return outriggerTester.getBarsOnViewWithTitle(title)
        })
        .then((bars) => {
            expect(bars.length).to.be.equal(10);
        })
        .then(() => {
            return outriggerTester.waitForXAxisLabelOnViewWithTitle(title, [
                'sea.3','nyc.5','sea.9','nyc.2','sea.6',
                'sea.0','sjc.7','nyc.8','sjc.4','sjc.1'
            ])
        });
    });

});
