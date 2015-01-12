#!/usr/bin/env node
var express = require('express');

var config = require('./config');
var phrases = require('./phrases');

var app = express();

app.get('/random/:lang/:num?', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    phrases.generate(req.params.num, req.params.lang).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        res.sendStatus(500);
        console.dir(err);
    });
});

app.listen(config.http.port);
