const db = require('../database/dbConfig.js');

module.exports = {
    findRecipes,
    findRecipesById,
    findBy,
    addRecipe,
    updateRecipe,
    removeRecipe,
    findRecipesByChefId
};

function findRecipes(){
    return db('recipes');
}

function findRecipesById(id){
    return db('recipes').where({ id }).first();
}

function findBy(filter){
    return db('recipes').where(filter)
}

function addRecipe(recipe){
    return db('recipes')
    .insert(recipe)
}

function updateRecipe(changes, id){
    return db('recipes')
    .where({ id })
    .update(changes)
    .then(recipe => {
        return recipe
    })
}

function removeRecipe(id){
    return db('recipes')
    .where({ id })
    .delete();
}

function findRecipesByChefId(id){
    return db('recipes')
    .where('chef_id', id);
}