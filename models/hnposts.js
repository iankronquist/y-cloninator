module.exports = function (bookshelf) {
  return bookshelf.Model.extend({
    tableName: 'hnposts'
  });
}
