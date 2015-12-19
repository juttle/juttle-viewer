"use strict";

let webdriver = require('selenium-webdriver');
let By = webdriver.By;
let until = webdriver.until;

class DemoAppTester {
    constructor(driver) {
        this._driver = driver;

        // bind the methods so that they don't need to be bound every time
        // they are passed to a function for invoking
        this.clickPlay = this.clickPlay.bind(this);
        this.findInputControl = this.findInputControl.bind(this);
        this.getLoggerOutput = this.getLoggerOutput.bind(this);
        this.loadFile = this.loadFile.bind(this);
    }

    clickPlay() {
        return this._driver.findElement(By.name('play'))
            .then(function(button) {
                return button.click();
            });
    }

    findInputControl(inputControlLabel) {
        return this._driver.wait(until.elementLocated(By.css(`.inputs-view div[data-input-label=${inputControlLabel}]`)))
            .then((elem) => {
                return elem.findElement(By.css("input"));
            });
    }

    getLoggerOutput(title) {
        return this._driver.wait(until.elementLocated(By.xpath(`//div[@class="jut-chart-title" and text()="${title}"]/../../..//textarea`)))
            .then(function(elem) {
                return elem.getAttribute("value");
            });
    }

    loadFile(filepath) {
        return this._driver.get(`http://localhost:2000/?path=${filepath}`);
    }
};

module.exports = DemoAppTester;
