#!/usr/bin/env node
var express = require('express');
var Keen = require('express-keenio');

var config = require('./config');
var logger = require('./logger');
var phrases = require('./phrases');

var app = express();

var keenexpress = Keen.configure({
    'client': config.keenio
});
var keen = keenexpress.keenClient;

app.set('json spaces', 2);

app.use(keenexpress.handleAll())

app.get('/random/:lang/:num?', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    /* Generate the phrases, then return */
    phrases.generate(req.params.num, req.params.lang).then(function (data) {
        res.json(data);

    }).catch(function (err) {
        res.sendStatus(500);
        logger.error('Error generating phrases', err);
    });
});

app.listen(config.http.port);
