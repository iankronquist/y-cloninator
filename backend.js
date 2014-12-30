"use strict"
var http = require('follow-redirects').http;

var top_stories_url = 'http://hacker-news.firebaseio.com/v0/topstories.json';
var post_details_url_prefix = 'http://hacker-news.firebaseio.com/v0/item/';
var post_details_url_suffix = '.json';
var gh_responses = [];


var on_contents = function(url, cb) {
    var req = http.get(url, function(res)
    {
        var data = '';
        res.on('data', function(chunk) {
            data += chunk.toString();
        });

        res.on('end', function(){
            cb(data);
        });
    }).end();

}

function postUrl(post_id) {
    return post_details_url_prefix + post_id + post_details_url_suffix;
}

function checkPost(data) {
    var post_details = JSON.parse(data);
    var repository_url = post_details.url.match(/(https?:\/\/github\.com\/.*\/.*).*?/);
    if (repository_url) {
        console.log(repository_url);

    }
}

function processHNPosts(data) {
    var top_list = JSON.parse(data);
    top_list.forEach(function(entry) {
        on_contents(postUrl(entry), checkPost);
    });
}

on_contents(top_stories_url, processHNPosts);
