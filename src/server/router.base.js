'use strict';
let express = require('express');

module.exports = function(opts, assetsMiddleware, indexPath) {
    let router = express.Router();

    router.use('/assets', assetsMiddleware);

    router.get('/', (req, res) => {
        res.sendFile(indexPath);
    });

    return router;
}
