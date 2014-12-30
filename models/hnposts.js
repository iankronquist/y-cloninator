module.exports = function (app) {
  var bookshelf = app.get('bookshelf');
  return bookshelf.Model.extend({
    tableName: 'hnposts'
  });
}
