var schedule = require('node-schedule');
var environment = process.env.Environment || 'develop';
var connection = require('knexfile')[environment];
var knex = require('knex')(connection);
var bookshelf = require('bookshelf')(knex);
var GHProjects = require('./models/ghprojects')(bookshelf);
var HNPosts = require('./models/hnposts')(bookshelf);

var job = schedule.scheduleJob('*/10 8-20 * * *', function () {
  updateDB();
});

function updateDB() {
  getLatestHNPosts();

  dropOldPosts();
}
