module.exports = function (app) {
  var bookshelf = app.get('bookshelf');
  var HNProjects = require('./hnposts')(app);
  return bookshelf.Model.extend({
    tableName: 'ghprojects',
    hn_id: function () {
      return this.hasOne('hnposts', 'hn-id');
    },
  });
}
