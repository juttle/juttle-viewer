'use strict';

let fs = require('fs');
let path = require('path');
let express = require('express');
let _ = require('underscore');

let DIST_DIR = path.join(__dirname, '../..', 'dist');
let INDEX_PATH = path.join(DIST_DIR, 'index.html');

module.exports = (opts) => {
    opts = opts || {};

    let router = express.Router();
    let indexPath = opts.indexPath || INDEX_PATH;

    let indexTemplate = fs.readFileSync(indexPath, 'utf8');
    let formattedIndex = _.template(indexTemplate, { variable: 'info' })({
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
