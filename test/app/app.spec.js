"use strict";

let DemoAppTester = require('./lib/demo-app-tester');
let webdriver = require('selenium-webdriver');
let expect = require('chai').expect;
let path = require('path');

const TEST_TIMEOUT = 10000;
const BROWSER = "from";
const WEBDRIVER_URL = "http://localhost:9515/";


// skipped while webdriver is not properly configured in travis
describe.skip("demo-app", function() {
    this.timeout(TEST_TIMEOUT);
    let driver;
    let demoAppTester;
    beforeEach(() => {
        driver = new webdriver.Builder()
            .forBrowser(BROWSER)
            .usingServer(WEBDRIVER_URL)
            .build();
        demoAppTester = new DemoAppTester(driver);
    });

    it("open juttle program with no inputs", () => {
        return demoAppTester.loadFile(path.join(__dirname, "juttle", "no-inputs.juttle"))
           .then(() => {
               return demoAppTester.getLoggerOutput('myLogger');
           })
           .then((value) => {
               expect(JSON.parse(value)).to.deep.equal([{time: new Date(0).toISOString(), v: 10}]);
           });
    });

    it("open juttle program with an input, fill it out, and run", () => {
        return demoAppTester.loadFile(path.join(__dirname, "juttle", "one-input.juttle"))
            .then(() => {
                return demoAppTester.findInputControl("a");
            })
            .then((inputElem) => {
                inputElem.sendKeys("AAA");
            })
            .then(demoAppTester.clickPlay)
            .then(() => {
                return demoAppTester.getLoggerOutput('myLogger');
            })
            .then((value) => {
                expect(JSON.parse(value)).to.deep.equal([{time: new Date(0).toISOString(), v: "AAA"}]);
            });
    });

    afterEach(() => {
        driver.quit();
    });
});
