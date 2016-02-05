'use strict';
let express = require('express');
let fs = require('fs');
let dot = require('dot');

module.exports = function(opts, assetsMiddleware, indexPath) {
    // create index file with juttleEngineHosts attached
    let indexTemplate = fs.readFileSync(indexPath, 'utf8');
    let formattedIndex = dot.template(indexTemplate)({
        JUTTLE_ENGINE_HOST: opts.juttleEngineHost
    });

    let router = express.Router();

    router.use('/assets', assetsMiddleware);

    router.get('/', (req, res) => {
        res.set('Content-Type', 'text/html');
        res.send(formattedIndex);
    });

    return router;
}
