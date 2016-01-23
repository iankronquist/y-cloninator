'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('ghprojects', function (table) {
    table.integer('gh_stars');
  });
};

exports.down = function(knex, Promise) {
};
