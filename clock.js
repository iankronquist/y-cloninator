var schedule = require('node-schedule');
var backend = require('./backend');

// every ten minutes from 8:00-20:00
var job = schedule.scheduleJob('*/10 8-20 * * *', function () {
    runJob();
});

function runJob() {
    console.log("Starting job.");
    backend.httpGet(
        backend.hn_api_host,
        '/v0/topstories.json',
        backend.processHNPosts);
    backend.clearOldPosts();
}

module.exports.forceUpdate = runJob;
