#!/usr/bin/env node
var express = require('express');
var Keen = require('express-keenio');
var morgan = require('morgan');

var config = require('./config');
var logger = require('./logger');
var phrases = require('./phrases');

var app = express();

if (config.keenio.url) {
    var keenexpress = Keen.configure({
        'client': config.keenio
    });
    var keen = keenexpress.keenClient;

    app.use(keenexpress.handleAll());
}

app.set('json spaces', 2);

app.use(morgan('dev'));

app.get('/random/:lang/:num?', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var options = {};
    options.nc = !!(req.query.nc && req.query.nc == 'true');

    logger.debug(JSON.stringify(options));

    var num = Math.min(100, req.params.num || req.query.num || 5);

    /* Generate the phrases, then return */
    phrases.generate(num, req.params.lang, options).then(function (data) {
        res.json(data);

    }).catch(function (err) {
        res.sendStatus(500);
        logger.error('Error generating phrases', err);
    });
});

app.listen(config.http.port);
