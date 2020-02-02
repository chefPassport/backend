
exports.up = function(knex) {
  return knex.schema
  .createTable('recipes', recipes => {
    recipes.increments();
    
    recipes.string('recipe_title', 128).notNullable();
    recipes.string('image').notNullable();
    recipes.string('ingredients').notNullable();
    recipes.string('instructions').notNullable();
    recipes.string('meal_type').notNullable()
        .unsigned()
        .references('id')
        .inTable('recipes')
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
    recipes.string('meal_type_name', 128).notNullable();
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('recipes');
};
