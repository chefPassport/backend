
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
    .createTable('recipes', recipes => {
        recipes.increments();
        
        recipes.string('recipe_title', 128).notNullable();
        recipes.string('image').notNullable();
        recipes.text('ingredients').notNullable();
        recipes.text('instructions').notNullable();
        recipes.string('meal_type').notNullable();
        recipes.integer('chef_id').notNullable()
            .unsigned()
            .references('id')
            .inTable('chefs')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
      })
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('chefs')
    .dropTableIfExists('recipes');
};
