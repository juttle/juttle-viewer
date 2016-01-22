'use strict';

let OutriggerTester = require('./lib/outrigger-tester');
let path = require('path');
let expect = require('chai').expect;

const TEST_TIMEOUT = 10000;

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
            return outriggerTester.waitForYAxisTitleOnViewWithTitle(title, 'CPU %');
        })
        .then(() => {
            return outriggerTester.waitForXAxisTitleOnViewWithTitle(title, 'hostname');
        })
        .then(() => {
            return outriggerTester.waitForXAxisLabelOnViewWithTitle(title, [
                'sea.3','nyc.5','sea.9','nyc.2','sea.6',
                'sea.0','sjc.7','nyc.8','sjc.4','sjc.1'
            ])
        });
    });

    it('can render a simple barchart with "horizontal" orientation', () => {
        var title = 'Average CPU % per host for last 10 minutes';
        return outriggerTester.run({
            path: path.join(__dirname, 'juttle', 'horizontal_barchart.juttle')
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
            return outriggerTester.waitForXAxisTitleOnViewWithTitle(title, 'CPU %');
        })
        .then(() => {
            return outriggerTester.waitForYAxisTitleOnViewWithTitle(title, 'hostname');
        })
        .then(() => {
            return outriggerTester.waitForYAxisLabelOnViewWithTitle(title, [
                'sjc.1', 'sjc.4', 'nyc.8', 'sjc.7', 'sea.0',
                'sea.6', 'nyc.2', 'sea.9', 'nyc.5', 'sea.3'
            ])
        });
    });

    it('can render a barchart with negative and positive values', () => {
        var title = 'Target average response time comparison';
        return outriggerTester.run({
            path: path.join(__dirname, 'juttle', 'up_and_down_barchart.juttle')
        })
        .then(() => {
            return outriggerTester.waitForViewTitle(title);
        })
        .then(() => {
            return outriggerTester.waitForXAxisLabelOnViewWithTitle(title, [
                'sea.0', 'sjc.1', 'nyc.2', 'sea.3'
            ]);
        })
        .then(() => {
            return outriggerTester.getBarsOnViewWithTitle(title)
        })
        .then((bars) => {
            expect(bars.length).to.be.equal(4);

            var barColors = [];
            return Promise.each(bars, function(bar) {
                return outriggerTester.getComputedStyleValue(bar, 'fill')
                .then((value) => {
                    barColors.push(value);
                });
            })
            .then(() => {
                expect(barColors).to.deep.equal([
                    'rgb(0, 128, 0)',
                    'rgb(0, 128, 0)',
                    'rgb(0, 128, 0)',
                    'rgb(128, 0, 0)'
                ]);
            });
        });
    });

});
