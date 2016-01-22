var backend = require('./backend');

module.exports = function(app) {
  var knex = app.get('knex');

  function displayUTCDate(timestamp) {
    var date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString();
  }

  function makeBaseQuery() {
    return knex.select(
      'ghprojects.gh_url',
      'ghprojects.gh_name',
      'ghprojects.gh_description',
      'ghprojects.gh_stars',
      'ghprojects.gh_language',
      knex.raw('count(*) as hn_mentions'),
      knex.raw('min(hnposts.hn_time) as hn_first_mention_timestamp'),
      knex.raw('max(hnposts.hn_time) as hn_last_mention_timestamp'),
      knex.raw('min(hnposts.id) as hn_first_mention_id'),
      knex.raw('max(hnposts.id) as hn_last_mention_id')
    )
      .from('ghprojects')
      .join('hnposts', 'ghprojects.gh_url', 'hnposts.gh_url')
      .groupBy('ghprojects.gh_url')
      .orderBy('hn_last_mention_id', 'desc');
  }

  var searchLanguage = function(res, language) {
      makeBaseQuery()
      .whereRaw('LOWER(ghprojects.gh_language) = LOWER(?)', [language])
      .then(function (projects) {
        return res.render('index.hjs', {
          filter_lang: language,
          projects: projects,
          hnItemUrl: backend.hnItemUrl,
          displayUTCDate: displayUTCDate
        });
      }).catch(function (error) {
        console.error(error);
      });
  };

  app.get('/', function (req, res) {
      makeBaseQuery()
      .then(function(projects) {
        return res.render('index.hjs', {
          projects: projects,
          hnItemUrl: backend.hnItemUrl,
          displayUTCDate: displayUTCDate
        });
      }).catch(function (error) {
        console.error(error);
      });
  });

  app.get('/refresh-content', function (req, res) {
    console.log("Starting job.");
    backend.httpGet(
        backend.hn_api_host,
        '/v0/topstories.json',
        backend.processHNPosts);
    backend.clearOldPosts();
    res.redirect('/');
  });

  app.get('/:language', function (req, res) {
    return searchLanguage(res, req.params.language);
  });

  app.post('/', function (req, res) {
    return searchLanguage(res, req.body.language);
  });

};
