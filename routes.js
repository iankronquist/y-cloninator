module.exports = function(app) {
  var GHProjects = require('./models/ghprojects')(app);
  app.get('/', function (req, res) {
    new GHProjects().fetchAll().then(function (projects) {
        return res.render('index.hjs', { projects: projects });
      }
    );
	});
};
