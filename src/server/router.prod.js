'use strict';
let fs = require('fs');
let path = require('path');
let express = require('express');
let routerBase = require('./router.base');

let DIST_DIR = path.join(__dirname, '../..', 'dist');

module.exports = (opts) => {
    let distDirExists = false;

    try {
        let distDir = fs.statSync(DIST_DIR);
        distDirExists = distDir.isDirectory();
    }
    catch(err) {
        // do nothing
    }

    if (!distDirExists) {
        let error =  new Error('Directory \'dist\' not found.');
        error.code = 'DIST-NOT-FOUND';
        throw error;
    }

    let assetsMiddleware = express.static(DIST_DIR);
    let indexPath = path.join(DIST_DIR, 'index.html');

    return routerBase(opts, assetsMiddleware, indexPath);
};
