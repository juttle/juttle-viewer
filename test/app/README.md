These tests test the full flow of loading a juttle file into outriggerd, filling out inputs if there are any, and verifying that the program output is correct.

They are not fully automated yet and require some manual startup of services.

* Install [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/downloads) and start it (starts on default port 9515)
* Make sure outriggerd is running

To run the tests:
```
mocha app.spec.js
```
