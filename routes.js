var backend = require('./backend');

module.exports = function(app) {
  var knex = app.get('knex');

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

  app.get('/:language', function (req, res) {
    return searchLanguage(res, req.params.language);
  });

  app.post('/', function (req, res) {
    return searchLanguage(res, req.body.language);
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

};
