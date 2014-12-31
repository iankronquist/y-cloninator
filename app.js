/*jslint node: true */
'use strict';

var express = require('express');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var knex = require('knex')({
  client: process.env.Client || 'sqlite3',
  connection: process.env.DATABASE_URL || { filename: 'dev.sqlite3' }
});
var bookshelf = require('bookshelf')(knex);

var app = express();
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('bookshelf', bookshelf);
app.set('knex', knex);

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

var routes = require('./routes')(app);

app.listen(process.env.Port || 8000, function () {
  console.log('App now listening on %s', process.env.Port || 8000);
});
