'use strict';

exports.up = function(knex, Promise) {
   return knex.schema.createTable('hnposts', function (table) {
    table.integer('id').primary();
    table.timestamp('retrievedAt');
  }).createTable('ghprojects', function (table) {
    table.integer('hn_id').references('id').inTable('hnposts');
    table.string('hn_url');
    table.string('gh_url').primary();
    table.string('gh_name');
    table.string('gh_description');
    table.string('gh_language');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('hnposts')
    .dropTable('ghprojects');
};
