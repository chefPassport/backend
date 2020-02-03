const express = require('express');

const Recipes = require('./recipes-model.js');

const router = express.Router();

// GET all recipes /api/recipes
router.get('/', (req, res) => {
    Recipes.findRecipes()
    .then(recipes => {
        res.status(200).json(recipes);
    })
    .catch(error => {
        res.status(500).json({
            error: "Recipes could not be retrieved."
        });
    });
});

// GET specific recipe /api/recipes/:id
router.get('/:id', (req, res) =>{
    Recipes.findRecipesById(req.params.id)
    .then(recipe => {
        res.status(200).json(recipe);
    })
    .catch(error => {
        res.status(500).json({
            error: "Recipe could not be retrieved"
        });
    });
});

// POST (create) new recipe /api/recipes
router.post('/', (req, res) => {
    let newRecipe = req.body;

    Recipes.addRecipe(newRecipe)
    .then(saved =>{
        res.status(201).json(saved);
    })
    .catch(error => {
        res.status(500).json(error);
    })
})

// ??? GET specific Chef's recipe /api/chef/:id/recipes

module.exports = router;