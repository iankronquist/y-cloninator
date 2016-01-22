'use strict';

exports.up = function(knex, Promise) {
   return knex.schema.createTable('ghprojects', function (table) {
    table.string('gh_url').primary();
    table.string('gh_name');
    table.string('gh_description');
    table.string('gh_language');
  }).createTable('hnposts', function (table) {
   table.integer('id').primary();
   table.string('gh_url').references('gh_url').inTable('ghprojects');
   table.timestamp('retrievedAt');
   table.string('hn_url');
   table.string('hn_time');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('hnposts')
    .dropTable('ghprojects');
};
