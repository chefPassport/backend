
exports.up = function(knex) {
  return knex.schema
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
  .dropTableIfExists('recipes');
};
