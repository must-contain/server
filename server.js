#!/usr/bin/env node
var express = require('express');

var phrases = require('./phrases');

var app = express();

app.get('/', function (req, res) {
    res.redirect('/all');
});

app.get('/all', function (req, res) {
    res.json(phrases.all());
});

app.get('/random/:num?', function (req, res) {
    res.json(phrases.random(req.params.num));
});

app.listen(process.env.PORT);
