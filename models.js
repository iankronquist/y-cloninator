var bookshelf = app.get('bookshelf');

var HNPost = bookshelf.Model.extend({
  tabelname: 'hnposts',
});

var GHProject = bookshelf.Model.extend({
  tabelname: 'ghprojects',
  hn-id: function () {
    return this.hasOne('hnposts', 'hn-id');
  },
});

