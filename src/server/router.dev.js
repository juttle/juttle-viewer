'use strict';
let path = require('path');
let webpack = require('webpack');
let webpackDevMiddleware = require('webpack-dev-middleware');
let routerBase = require('./router.base');

let webpackConfig = require('../../webpack.config');

module.exports = (opts) => {
    let compiler = webpack(webpackConfig);
    let assetsMiddleware = webpackDevMiddleware(compiler, { noInfo: true });
    let indexPath = path.join(__dirname, '../apps/assets/index.html');

    return routerBase(opts, assetsMiddleware, indexPath);
};
