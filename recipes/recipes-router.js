const express = require('express');

const Recipes = require('./recipes-model.js');

const router = express.Router();

/**
 * @api {get} /api/recipes Get all recipes
 * @apiName GetRecipes
 * @apiGroup Recipes
 * 
 * @apiSuccess {Number} id Recipe id
 * @apiSuccess {string} recipe_title Recipe Title
 * @apiSuccess {string} image Recipe Img
 * @apiSuccess {string} ingredients Recipe Ingredients
 * @apiSuccess {string} instructions Recipe Instructions
 * @apiSuccess {string} meal_type Recipe Meal Type
 * @apiSuccess {Number} chef_id Chef's Id
 * 
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * [
*  {
*       "id": 1,
*        "recipe_title": "PB&J Sandwich",
*        "image": "https://images.unsplash.com/photo-1557275357-072087771588?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80",
*        "ingredients": "tbsp of peanut butter, tbsp of jelly, and 2 slices of bread",
*        "instructions": "Spread peanut butter on one slice of bread. Spread jelly on other. Combine and bam!",
*        "meal_type": "Snack",
*        "chef_id": 1
*    },
*    {
*        "id": 2,
*        "recipe_title": "Scrambled eggs",
*        "image": "https://images.unsplash.com/photo-1551185618-5d8656fd00b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2978&q=80",
*        "ingredients": "2 eggs, black pepper, and salt",
*        "instructions": "Heat pan. Lightly coat pan with non-stick cooking spray. Beat eggs in bowl. Add a pinch of salt and pepper to taste. Add eggs to pan and stir. Heat until cooked. Enjoy.",
*        "meal_type": "Breakfast",
*        "chef_id": 1
*    },
*]
 */


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

/**
 * @api {get} /api/recipes/:id Get specific recipe
 * @apiName GetSpecificRecipe
 * @apiGroup Recipes
 * 
 * @apiParam {Number} id Recipe id
 * 
 * @apiSuccess {Number} id Recipe id
 * @apiSuccess {string} recipe_title Recipe Title
 * @apiSuccess {string} image Recipe Img
 * @apiSuccess {string} ingredients Recipe Ingredients
 * @apiSuccess {string} instructions Recipe Instructions
 * @apiSuccess {string} meal_type Recipe Meal Type
 * @apiSuccess {Number} chef_id Chef's Id
 * @apiSuccess {object} chef Chef Info
 * 
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
*     "id": 1,
*     "recipe_title": "PB&J Sandwich",
*     "image": "https://images.unsplash.com/photo-1557275357-072087771588?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80",
*     "ingredients": "tbsp of peanut butter, tbsp of jelly, and 2 slices of bread",
*     "instructions": "Spread peanut butter on one slice of bread. Spread jelly on other. Combine and bam!",
*     "meal_type": "Snack",
*     "chef_id": 1,
*     "chef": {
*            "id": 1,
*            "name": "Jim Smith",
*            "username": "user1",
*            "password": "user1test123",
*            "location": "Pittsburgh, PA",
*            "contact_info": "jsmithchef@gmail.com"
*            }
* }
 *  
 **/

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

/**
 * @api {post} /api/recipes Create/Post new recipe
 * @apiName CreateRecipe
 * @apiGroup Recipes
 * 
 * @apiParam {string} recipe_title Recipe Title
 * @apiParam {string} image Recipe Img
 * @apiParam {string} ingredients Recipe Ingredients
 * @apiParam {string} instructions Recipe Instructions
 * @apiParam {string} meal_type Recipe Meal Type
 * @apiParam {Number} chef_id Chef's Id
 * 
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "New Recipe Added!"
 * }
 * 
*/

// POST (create) new recipe /api/recipes
router.post('/', (req, res) => {
    let newRecipe = req.body;

    Recipes.addRecipe(newRecipe)
    .then(newRecipe =>{
        if(newRecipe){
            res.status(201).json({message: 'New Recipe Added!'});
        }else{
            res.status(409).json({message: 'Could not create recipe'})
        }
    })
    .catch(error => {
        res.status(500).json(error);
    })
})


module.exports = router;