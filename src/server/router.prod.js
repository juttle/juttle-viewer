'use strict';

let fs = require('fs');
let path = require('path');
let express = require('express');

let DIST_DIR = path.join(__dirname, '../..', 'dist');

module.exports = () => {
    let router = express.Router();
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

    // serve static assets from dist
    router.use('/assets', express.static(DIST_DIR));

    router.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../../dist/index.html'));
    });

    return router;
};
