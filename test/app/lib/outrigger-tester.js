'use strict';

var _ = require('underscore');
var expect = require('chai').expect;
var Promise = require('bluebird');
var retry = require('bluebird-retry');

var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;

var nconf = require('nconf');
nconf.argv().env();

// setup log level to be quiet by default
var logSetup = require('../../../bin/log-setup');
logSetup.init({
    // set LOGLEVEL=OFF to quiet all logging
    'log-level': nconf.get('LOGLEVEL') || 'INFO'
});

if (!nconf.get('SELENIUM_BROWSER')) {
    // default to chrome
    process.env['SELENIUM_BROWSER'] = 'chrome';
}

var JuttledService = require('../../../lib/service-juttled');

const outrigger_port = 2000;

class OutriggerTester {
    constructor() {
        // bind the methods so that they don't need to be bound every time
        // they are passed to a function for invoking
        this.clickPlay = this.clickPlay.bind(this);
        this.findInputControl = this.findInputControl.bind(this);
        this.getTextOutput = this.getTextOutput.bind(this);
        this.run = this.run.bind(this);
        this.waitForTextOutputToContain = this.waitForTextOutputToContain.bind(this);
    }

    start(cb) {
        this.outrigger = new JuttledService({
            port: outrigger_port,
            root_directory: '/'
        }, cb);

        this.driver = new webdriver.Builder()
            .build();
    }

    stop() {
        if (!nconf.get('KEEP_BROWSER')) {
            this.driver.quit();
        }

        this.outrigger.stop();
    }

    clickPlay() {
        return this.driver.findElement(By.id('btn-run'))
        .then((button) => {
            return button.click();
        });
    }

    findInputControl(inputControlLabel) {
        var element = until.elementLocated(By.css(`.inputs-view div[data-input-label=${inputControlLabel}]`));
        return this.driver.wait(element)
        .then((elem) => {
            return elem.findElement(By.css('input'));
        });
    }

    getInputControlValue(inputControlLabel) {
        var element = until.elementLocated(By.css(`.inputs-view div[data-input-label=${inputControlLabel}]`));
        return this.driver.wait(element)
        .then((elem) => {
            return elem.findElement(By.css('input'));
        }).
        then((elem) => {
            return elem.getAttribute('value');
        });
    }

    writeIntoInputControl(inputControlLabel, text) {
        var self = this;

        return this.findInputControl(inputControlLabel)
        .then((inputElem) => {
            return retry(() => {
                inputElem.clear();
                _.each(text, (key) => {
                    inputElem.sendKeys(key);
                });
                return self.getInputControlValue(inputControlLabel)
                .then((value) => {
                    expect(value).to.equal(text);
                });
            });
        });
    }

    findViewByTitle(title) {
        var locator = `//div[@class='jut-chart-title' and text()='${title}']/ancestor::div[contains(@class,'juttle-view')]`;
        return this.driver.wait(until.elementLocated(By.xpath(locator)));
    }

    waitForViewTitle(title) {
        return this.findViewByTitle(title);
    }

    getErrorMessage() {
        var locator = By.css('.juttle-client-library.error-view span');
        return this.driver.wait(until.elementLocated(locator))
        .then((element) => {
            return element.getAttribute('textContent');
        });
    }

    waitForJuttleErrorToContain(message, options) {
        var self = this;
        var defaults = {
            interval: 1000,
            timeout: 10000
        };
        options = _.extend(defaults, options);

        return retry(() => {
            return self.getErrorMessage()
            .then((value) => {
                expect(value).to.contain(message);
            });
        }, options);
    }

    waitForJuttleErrorToEqual(message, options) {
        var self = this;
        var defaults = {
            interval: 1000,
            timeout: 10000
        };
        options = _.extend(defaults, options);

        return retry(() => {
            return self.getErrorMessage()
            .then((value) => {
                expect(value).to.equal(message);
            });
        }, options);
    }

    getTextOutput(title) {
        return this.findViewByTitle(title)
        .then((element) => {
            return element.findElement(By.css('textarea'));
        })
        .then((elem) => {
            return elem.getAttribute('value');
        });
    }

    waitForTextOutputToContain(title, data, options) {
        var self = this;

        var defaults = {
            interval: 1000,
            timeout: 10000
        };
        options = _.extend(defaults, options);

        return retry(() => {
            return self.getTextOutput(title)
            .then((value) => {
                expect(JSON.parse(value)).to.deep.equal(data);
            });
        }, options);
    }

    getXAxisLabelsOnViewWithTitle(title) {
        return this.findViewByTitle(title)
        .then((view) => {
            return this.driver.wait(until.elementLocated(By.css('.x.axis .tick text')))
            .then(() => {
                return view.findElements(By.css('.x.axis .tick text'));
            });
        });
    }

    waitForXAxisLabelOnViewWithTitle(title, labels) {
        return this.getXAxisLabelsOnViewWithTitle(title)
        .then(function(labelElements) {
            return Promise.each(labelElements, function(labelElement, index) {
                return labelElement.getAttribute('textContent')
                .then((text) => {
                    expect(text).to.equal(labels[index]);
                });
            });
        });
    }

    getBarsOnViewWithTitle(title) {
        return this.findViewByTitle(title)
        .then((view) => {
            return this.driver.wait(until.elementLocated(By.css('rect.bar')))
            .then(() => {
                return view.findElements(By.css('rect.bar'));
            });
        });
    }

    run(options) {
        var params = _.map(options, (value, name) => {
            return `${name}=${value}`;
        });
        var host = nconf.get('OUTRIGGER_HOST') || 'localhost';
        return this.driver.get('http://' + host + ':' + outrigger_port + '/run?' + params.join('&'));
    }
}

module.exports = OutriggerTester;
