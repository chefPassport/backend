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
    const { id } = req.params;

    Recipes.findRecipesById(id)
    .then(recipe => {
        if(recipe){
            Recipes.getChefsById(id)
            .then(chef => {
                let chefInfo = []
                if(chef){
                    chefInfo = chef
                }
                res.json({...recipe, chef: chefInfo})
            })
            .catch(error => {
                res.status(500).json({ message: 'Failed at chef info nested'});
            });
        } else {
            res.status(404).json({message: "Could not get recipe with provided id"})
        }
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


module.exports = router;