module.exports = function (bookshelf) {
  var HNProjects = require('./hnposts')(bookshelf);
  return bookshelf.Model.extend({
    tableName: 'ghprojects',
    hn_id: function () {
      return this.hasOne('hnposts', 'hn-id');
    },
  });
}
