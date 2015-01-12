#!/usr/bin/env node
var express = require('express');
var Keen = require('keen.io');

var config = require('./config');
var phrases = require('./phrases');

var app = express();
var keen = new Keen(config.keenio);

app.set('json spaces', 2);

app.get('/random/:lang/:num?', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    /* Generate the phrases, then return */
    phrases.generate(req.params.num, req.params.lang).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        res.sendStatus(500);
        console.dir(err);
    });

    /* Send info of this request to Keen.IO */
    keen.addEvent('req-random', {
        'language': req.params.lang,
        'number': req.params.num
    });
});

app.listen(config.http.port);
