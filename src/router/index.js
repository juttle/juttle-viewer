'use strict';

let fs = require('fs');
let path = require('path');
let express = require('express');
let dot = require('dot');

let DIST_DIR = path.join(__dirname, '../..', 'dist');
let INDEX_PATH = path.join(DIST_DIR, 'index.html');

module.exports = (opts) => {

    if (!opts.juttleServiceHost) {
        let error = new Error('Must provide juttleServiceHost option');
        error.code = 'NO-JS-HOST';
        throw error;
    }

    let router = express.Router();
    let indexPath = opts.indexPath || INDEX_PATH;

    let indexTemplate = fs.readFileSync(indexPath, 'utf8');
    let formattedIndex = dot.template(indexTemplate)({
        JUTTLE_SERVICE_HOST: opts.juttleServiceHost
    });

    // serve static assets from dist
    router.use('/assets', express.static(DIST_DIR));

    router.get('/', (req, res) => {
        res.set('Content-Type', 'text/html');
        res.send(formattedIndex);
    });

    return router;
};
