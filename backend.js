/*jslint node: true */
"use strict";

var http = require('follow-redirects').https;

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

function saveGithubPost(data) {
    var post = JSON.parse(data);
    console.log(post.html_url);
}

function checkPost(data) {
    var post_details = JSON.parse(data);
    var repository_url = /https?:\/\/github.com(\/.*?\/[^\/]*).*?/.exec(
        post_details.url);
    if (repository_url) {
        httpGet('api.github.com', '/repos' + repository_url[1], saveGithubPost);
    }
}

function processHNPosts(data) {
    var top_list = JSON.parse(data);
    top_list.forEach(function(entry) {
        httpGet(hn_api_host,
                '/v0/item/' + entry + post_details_url_suffix,
                checkPost);
    });
}

httpGet(hn_api_host, '/v0/topstories.json', processHNPosts);
