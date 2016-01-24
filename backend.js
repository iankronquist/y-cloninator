/*jslint node: true */
"use strict";

var http = require('follow-redirects').https;

var knex = require('knex')({
  client: process.env.CLIENT || 'sqlite3',
  connection: process.env.DATABASE_URL || { filename: 'dev.sqlite3' }
});


var hn_api_host = 'hacker-news.firebaseio.com';
var post_details_url_suffix = '.json';
var gh_responses = [];

var httpGet = function(host, path, cb) {
    var options = {
        host: host,
        path: path,
        headers: {'User-Agent': 'Mozilla/5.0'}
    };

    var req = http.get(options, function(res) {
        var data = '';
        res.on('data', function(chunk) {
            data += chunk.toString();
        });
        res.on('end', function(){
            cb(data);
        });
        if (res.statusCode != 200) {
          console.log('HTTP Status code not OK!', host, path, data);
        }
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
};

function saveGithubPost(data) {
    var project = JSON.parse(data);
    if (!project.name) { // probably an API ratelimiting issue
      console.error("Could not get Github project! Received data: ");
      console.error(project);
      return;
    }
    knex('ghprojects').insert({
      gh_url: project.html_url,
      gh_name: project.name,
      gh_description: project.description,
      gh_stars: project.stargazers_count,
      gh_language: project.language
    }).then(function() {
      console.log("New project: " + project.name)
    }).catch(function(error) {
      console.log(error);
    });
}

function hnItemUrl(itemId) {
  return 'https://news.ycombinator.com/item?id=' + itemId;
}

function checkPost(data) {
    var post_details = JSON.parse(data);
    var repository_url = /https?:\/\/github.com(\/.*?\/[^\/]*).*?/.exec(
        post_details.url);
    if (!repository_url) {
      return;
    }
    knex('hnposts').insert({
      id: post_details.id,
      gh_url: repository_url[0],
      retrievedAt: Date.now(),
      hn_url: hnItemUrl(post_details.id),
      hn_time: post_details.time
    }).then(function () {
      httpGet('api.github.com', '/repos' + repository_url[1], saveGithubPost);
    }).catch(function(error) {
      console.error(error);
    });
}

function processHNPosts(data) {
    var current_time = new Date();
    var top_list = JSON.parse(data);
    top_list.forEach(function(entry) {
      httpGet(hn_api_host,
        '/v0/item/' + entry + post_details_url_suffix, checkPost);
    });
}

function clearOldPosts() {
    var date = new Date();
    date.setHours(date.getHours() - 2);

    // Split into two queries - join deletes aren't supported
    // https://github.com/tgriesser/knex/issues/873
    knex('hnposts')
      .distinct('gh_url')
      .select()
      .where('retrievedAt', '<', date)
      .then(function(posts) {
        var ghUrls = posts.map(function(post) { return post.gh_url });

        knex('hnposts')
          .whereIn('gh_url', ghUrls)
          .del();

        knex('ghprojects')
          .whereIn('gh_url', ghUrls)
          .del();
      }).catch(function(error) {
        console.error(error);
      });
}

module.exports.httpGet = httpGet;
module.exports.hn_api_host = hn_api_host;
module.exports.processHNPosts = processHNPosts;
module.exports.clearOldPosts = clearOldPosts;
module.exports.hnItemUrl = hnItemUrl;
