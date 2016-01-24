'use strict';

var backend = require('./backend');

module.exports = function(app) {
  var knex = app.get('knex');
  // 30 minutes
  var lastUpdated = 0;
  const halfHour = 30*60*60;

  var searchLanguage = function(res, language) {
    knex.select('*')
      .from('ghprojects')
      .whereRaw('LOWER(gh_language) = LOWER(?)', [language])
      .orderBy('hn_id', 'desc')
      .then(function (projects) {
        return res.render('index.hjs', {
          filter_lang: language,
          projects: projects
        });
      });
  };

  app.get('/', function (req, res) {
    knex.select('*').from('ghprojects')
    .orderBy('hn_id', 'desc').then(function(projects) {
      return res.render('index.hjs', { projects: projects });
    });
  });

  app.get('/refresh-content', function (req, res) {
    // Noop if we have refreshed the content in the past 1/2 hour
    // Of course this counter is reset if the app is restarted
    let rightNow = Date.now();
    if (rightNow >= (lastUpdated + halfHour)) {
      console.log('Refreshing DB', rightNow);
      lastUpdated = rightNow;
      backend.httpGet(
          backend.hn_api_host,
          '/v0/topstories.json',
          backend.processHNPosts);
          backend.clearOldPosts();
    } else {
      console.log('Not refreshing. Last new post retreived at ', lastUpdated);
    }
    res.redirect('/');
  });

  app.get('/:language', function (req, res) {
    return searchLanguage(res, req.params.language);
  });

  app.post('/', function (req, res) {
    return searchLanguage(res, req.body.language);
  });

};
