'use strict';

let path = require('path');
let express = require('express');
let webpack = require('webpack');
let webpackDevMiddleware = require('webpack-dev-middleware');

let webpackConfig = require('../../webpack.config');

module.exports = () => {
    let router = express.Router();

    let assetPath = webpackConfig.output.publicPath;

    let compiler = webpack(webpackConfig);
    router.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: assetPath
    }));

    router.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../apps/assets/index.html'));
    });

    return router;
};
