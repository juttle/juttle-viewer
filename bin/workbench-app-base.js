'use strict';

let express = require('express');
let argv = require('yargs')
    .usage('Usage: $0 [options]')
    .option('p', {
        alias: 'port',
        describe: 'Port to serve app on',
        default: 2000
    })
    .option('j', {
        alias: 'juttle-engine',
        describe: 'Host for juttle-engine',
        default: 'localhost:8080'
    })
    .help('h')
    .alias('h', 'help')
    .argv;

module.exports = function(appRouter) {
    let port = argv.p;
    let app = express();

    app.use(appRouter());

    app.listen(port, () => {
        console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
    });
}
