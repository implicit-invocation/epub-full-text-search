// impl restart 
// logging request 
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import async from 'async';
import search from './Rest-API/Search';
import matcher from './Rest-API/Matcher';
import addToIndex from './Rest-API/AddToIndex';
import deleteFromIndex from './Rest-API/DeleteFromIndex';

const WebService = {};

WebService.app = express();
// it possible to config cors for indivudal routes
// https://www.npmjs.com/package/cors
WebService.app.use(cors());
WebService.app.use(bodyParser.urlencoded({extended: true}));
WebService.app.use(bodyParser.json());

// routes
WebService.app.get('/search', search);
WebService.app.get('/matcher', matcher);
WebService.app.get('/addToIndex', addToIndex); // POST or GET???
WebService.app.get('/deleteFromIndex', deleteFromIndex); // POST or GET???

function terminator(sig) {
    if (typeof sig === "string") {
        console.log('[INFO] %s: Received %s - terminating service ...',
            Date(Date.now()), sig);
        process.exit(1);
    }
    console.log('[INFO] %s: EPUB search service stopped.', Date(Date.now()));
}


WebService.setup = function (callback) {

    // WebService.ipaddress = process.env.IP;
    WebService.port = process.env.PORT || 8085;

    process.on('exit', () => {
        terminator();
    });

    process.on('SIGTERM', () => {
        terminator();
    });

    callback();
};


WebService.startupMessages = function (callback) {
    console.log('');
    console.log('[INFO] EPUB-full-text-search Copyright (c) 2015-2017 Lars Voigt');
    console.log('[INFO] This program comes with ABSOLUTELY NO WARRANTY.');
    console.log('[INFO] This is free software, and you are welcome to redistribute it under certain conditions.');
    console.log('[INFO] For the full license, please visit: https://opensource.org/licenses/MIT');
    console.log('');
    callback();
};

WebService.start = function (callback) {
    //  Start the app on the specific interface (and port).
    WebService.app.listen(WebService.port, WebService.ipaddress, () => {
        //TODO: logging
        console.log('[INFO] %s: EPUB search started on %s:%d ...',
            new Date(), WebService.ipaddress, WebService.port);
    }).on('error', e => {

        if (e.code == 'EADDRINUSE') {
            return callback('Cant start this Service -> Port is in use!!!');
        }

    });
    callback();
};


async.series([
    WebService.setup,
    WebService.startupMessages,
    WebService.start
], err => {
    if (err) {
        console.error('[ERROR] Error during startup: ' + err);
        process.exit(1);
    }

});
