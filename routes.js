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
      .where({ gh_language: req.body.language })
      .then(function (projects) {
        return res.render('index.hjs', {
          filter_lang: req.body.language,
          projects: projects
        });
      });
  });
};
