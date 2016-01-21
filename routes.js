var backend = require('./backend');

module.exports = function(app) {
  var knex = app.get('knex');
  app.get('/', function (req, res) {
    knex.select('*').from('ghprojects').then(function(projects) {
      return res.render('index.hjs', { projects: projects });
    });
  });
  app.post('/', function (req, res) {
    knex.select('*')
      .from('ghprojects')
      .whereRaw('LOWER(gh_language) = LOWER(?)', [req.body.language])
      .then(function (projects) {
        return res.render('index.hjs', {
          filter_lang: req.body.language,
          projects: projects
        });
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

};
