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

function getLatestHNPosts() {
    // this function:
    //      1. gets the HN api for top stories
    //      2. fetches HN api for any new top stories
    //      3. any new GitHub results, fetch GitHub API and store in DB

}

function dropOldPosts() {
    // this function:
    //      1. deletes any items in hnposts older than a day that are not
    //         GitHub projects

}
