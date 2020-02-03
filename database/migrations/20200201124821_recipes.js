
exports.up = function(knex) {
  return knex.schema
  .createTable('recipes', recipes => {
    recipes.increments();
    
    recipes.string('recipe_title', 128).notNullable();
    recipes.string('image').notNullable();
    recipes.text('ingredients').notNullable();
    recipes.text('instructions').notNullable();
    recipes.integer('meal_type_id').notNullable()
        .unsigned()
        .references('id')
        .inTable('meal_type')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    recipes.integer('chef_id').notNullable()
        .unsigned()
        .references('id')
        .inTable('chefs')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
  })
  .createTable('meal_type', mealtypes => {
    mealtypes.increments();
    mealtypes.string('meal_type_name', 128).notNullable();
    });
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('meal_type')
  .dropTableIfExists('recipes');
};
