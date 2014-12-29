"use strict"
var nunjucks = require('nunjucks');
var knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));
app.set('bookshelf', bookshelf);


var routes = require('./routes')(app);
var models = require('./models')(app);


nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.listen(process.env.Port || 8000);
