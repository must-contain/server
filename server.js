#!/usr/bin/env node
var express = require('express');

var phrases = require('./phrases');

var app = express();

app.get('/', function (req, res) {
    res.redirect('/all');
});

app.get('/all', function (req, res) {
    phrases.all().then(function (data) {
        res.json(data);
    }).catch(function (err) {
        res.send(500);
    });
});

app.get('/random/:num?', function (req, res) {
    phrases.random(req.params.num).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        res.send(500);
    });
});

app.listen(process.env.PORT);
