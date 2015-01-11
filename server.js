#!/usr/bin/env node
var express = require('express');

var config = require('./config');
var phrases = require('./phrases');

var app = express();

app.get('/random/:lang/:num?', function (req, res) {
    phrases.generate(req.params.num, req.params.lang).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        res.send(500);
    });
});

app.listen(config.http.port);
