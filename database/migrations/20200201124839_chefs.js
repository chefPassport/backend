exports.up = function(knex) {
    return knex.schema
      .createTable('chefs', tbl => {
          tbl.increments();
          tbl.string('name');
          tbl.string('username', 50)
              .notNullable()
              .unique();
          tbl.string('password', 100)
              .notNullable();
          tbl.string('location');
          tbl.string('contact_info');
      })
  };
  
  exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('chefs')
  };
  