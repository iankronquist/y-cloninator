'use strict'
var express = require('express');
var nunjucks = require('nunjucks');
var knex = require('knex')({
  client: process.env.Client || 'sqlite3',
  connection: process.env.DATABASE_URL || { filename: 'dev.sqlite3' }
});
var bookshelf = require('bookshelf')(knex);

var app = express();
app.use(express.static(__dirname + '/static'));
app.set('bookshelf', bookshelf);

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

var routes = require('./routes')(app);

app.listen(process.env.Port || 8000, function () {
  console.log('App now listening on %s', process.env.Port || 8000);
});
