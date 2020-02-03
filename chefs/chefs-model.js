const db = require('../database/dbConfig');

module.exports = {
    add,
    findBy,
    getChefById,
    getChefRecipes,
    update,
    remove
}

function add(chef) {
    return db('chefs')
        .insert(chef, 'id')
        .then(ids => {
            const [id] = ids;
            return db('chefs')
                .where({ id })
                .first();
        })
}

function findBy(username) {
    return db('chefs')
        .where(username)
        .first();
}

function getChefById(id) {
    return db('chefs')
        .where({ id })
        .first();
}

function getPostByIdAllInfo(id) {
    return db('recipes')
    .where({ id })
    .first();
}

function getChefRecipes(id) {
    return db('recipes as r')
        .select('r.id', 'r.image', 'r.recipe_title', 'r.meal_type', 'r.ingredients', 'r.instructions', 'r.chef_id', 'c.name', 'c.location', 'c.contact_info')
        .join('chefs as c', 'r.chef_id', '=', 'c.id')
        .where('r.chef_id', id);
}

function update(id, changes) {
    return db('recipes')
        .where('id', id)
        .update(changes)
        .then(count => {
            if (count > 0) {
                return getPostByIdAllInfo(id);
            }
        })
}

function remove(id) {
    let deletedRecipe = {};
    db('recipes')
    .where({ id })
    .first()
    .then(recipe => {
        deletedRecipe = recipe; 
    });
    return db('recipes')
        .where('id', id)
        .del()
        .then(count => {
            if (count > 0) {
                return deletedRecipe;
            }
        });
}