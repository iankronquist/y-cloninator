"use strict"
var nunjucks = require('nunjucks');
var express = require('express');
var app = express();
var routes = require('./routes')(app);

app.use(express.static(__dirname + '/static'));

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.listen(process.env.Port || 8000);
