/*jslint node: true */
"use strict";

var http = require('follow-redirects').https;

var knex = require('knex')({
  client: process.env.CLIENT || 'sqlite3',
  connection: process.env.DATABASE_URL || { filename: 'dev.sqlite3' }
});

var Feed = require('feed');

var hn_api_host = 'hacker-news.firebaseio.com';
var post_details_url_suffix = '.json';
var gh_responses = [];


var httpGet = function(host, path, cb) {
    var options = {
        host: host,
        path: path,
        headers: {'User-Agent': 'Mozilla/5.0'}
    };

    var req = http.get(options, function(res)
    {
        var data = '';
        res.on('data', function(chunk) {
            data += chunk.toString();
        });
        res.on('end', function(){
            cb(data);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
};

function saveGithubPost(data, hn_data) {
    var post = JSON.parse(data);
    return knex('ghprojects').insert({
      hn_id: hn_data.id,
      hn_url: "https://news.ycombinator.com/item?id=" + hn_data.id,
      gh_url: post.html_url,
      gh_name: post.name,
      gh_description: post.description,
      gh_language: post.language
    }).catch(function(error) {
      console.log(error);
    });
}

function checkPost(data) {
    var post_details = JSON.parse(data);
    var repository_url = /https?:\/\/github.com(\/.*?\/[^\/]*).*?/.exec(
        post_details.url);
    if (repository_url) {
        httpGet('api.github.com', '/repos' + repository_url[1],
          function(gh_api_data) {
            saveGithubPost(gh_api_data, post_details);
          }
        );
    }
}

function createFeed() {
  var feed = new Feed({
    title:          'Y-Cloninator',
    description:    'Open source on Hacker News without the distractions!',
    link:           'https://ycloninator.herokuapp.com/',

    author: {
        name:       'Evan Tschuy & Ian Kronquist',
        email:      'evan@tschuy.com',
        link:       'http://tschuy.com'
    }
  });
  knex.select('*').from('ghprojects') //.whereNotNull('date')
  .orderBy('hn_id', 'desc').limit(50).then(function(projects) {
    for(var project of projects) {
      feed.item({
        title: project.gh_name,
        link: project.gh_url,
        description: project.gh_language + ": " + project.gh_description,
        author: [ { name: 'Y-Cloninator' } ],
        date: new Date()
      });
    }
    console.log(feed.render('rss-2.0'));
  }).catch(function(error) { console.log(error) });
}

function processHNPosts(data) {
    var current_time = new Date();
    var top_list = JSON.parse(data);
    top_list.forEach(function(entry) {
      knex('hnposts').insert({id: entry, retrievedAt: current_time})
        .then(function () {
          httpGet(hn_api_host,
                '/v0/item/' + entry + post_details_url_suffix, checkPost);
        }).then(createFeed) // TODO find better way to run this
                            // only one time per refresh
        .catch(function(error) {
          console.log(error);
        });
    });
}

function clearOldPosts() {
    var date = new Date();
    date.setHours(date.getHours() - 2);
    knex.select('*').from('hnposts')
        .leftOuterJoin('ghprojects', 'hnposts.id', 'ghprojects.hn_id')
        .whereNull('gh_url')
        .where('retrievedAt', '<', date)
        .del();
}

module.exports.httpGet = httpGet;
module.exports.hn_api_host = hn_api_host;
module.exports.processHNPosts = processHNPosts;
module.exports.clearOldPosts = clearOldPosts;
