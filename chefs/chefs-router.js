
const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require('jsonwebtoken');
const authenticate = require('../auth/authenticate-middleware');
const router = express.Router();


const Chefs = require('./chefs-model');
const Recipes = require('../recipes/recipes-model.js');


// REGISTER/LOGIN
router.post('/register', validateRegister, (req, res) => {
    let chefData = req.body;
    const hash = bcrypt.hashSync(chefData.password, 8);
    chefData.password = hash;
    console.log(chefData);
    Chefs.add(chefData)
    .then(user => {
        res.status(201).json(user);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: 'Failed to register new user '})
    })
});


router.post('/login', validateLogin, (req, res) => {
    let { username, password } = req.body;
    Chefs.findBy({ username })
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) { 
            const token = signToken(user);  
            res.status(200).json({ 
                message: `${user.username} Logged In!`, 
                token,
                id: user.id
            });
        } else {
            res.status(401).json({ message: 'Failed to login' });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: 'Failed to retrieve credentials '});
    })
});


/**
 * @api {get} /api/chefs/:id/recipes Get specific Chef's recipes
 * @apiName GetSpecificChefsRecipes
 * @apiGroup Chefs
 * 
 * @apiParam {Number} id Chef id
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
 *   {
 *       "id": 1,
 *       "recipe_title": "PB&J Sandwich",
 *       "image": "https://images.unsplash.com/photo-1557275357-072087771588?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80",
 *       "ingredients": "tbsp of peanut butter, tbsp of jelly, and 2 slices of bread",
 *       "instructions": "Spread peanut butter on one slice of bread. Spread jelly on other. Combine and bam!",
 *       "meal_type": "Snack",
 *       "chef_id": 1
 *   },
 *   {
 *       "id": 2,
 *       "recipe_title": "Scrambled eggs",
 *       "image": "https://images.unsplash.com/photo-1551185618-5d8656fd00b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2978&q=80",
 *       "ingredients": "2 eggs, black pepper, and salt",
 *       "instructions": "Heat pan. Lightly coat pan with non-stick cooking spray. Beat eggs in bowl. Add a pinch of salt and pepper to taste. Add eggs to pan and stir. Heat until cooked. Enjoy.",
 *       "meal_type": "Breakfast",
 *        "chef_id": 1
 *   }
 * ]
 * */

// GET specific Chef's recipe /api/chefs/:id/recipes
router.get('/:id/recipes', (req, res) => {
    const { id } = req.params;

    Recipes.findRecipesByChefId(id)
    .then(recipes => {
        if(recipes){
            res.json(recipes)
        } else {
            res.status(404).json({ error: 'Could not find recipes with provided ID'})
        }
    })
    .catch(error => {
        res.status(500).json(error);
    })
})

// ---------- Function for creating and signing token ----------- //

function signToken(user) {
    const payload = {
      username: user.username
    };
  
    const secret = process.env.JWT_SECRET || "secret here";
  
    const options = {
      expiresIn: "1h",
    };
  
    return jwt.sign(payload, secret, options); 
  }



// ----------------------- CUSTOM MIDDLEWARE ------------------------ //

function validateRegister(req, res, next) {
    const data = req.body;
    if (!data) {
        res.status(400).json({ error: 'missing required data' })
    } else if (!data.username) {
        res.status(400).json({ error: 'missing required username' })
    } else if (!data.password) {
        res.status(400).json({ error: 'missing required password' })
    } else if (!data.name) {
        res.status(400).json({ error: 'missing required name' })
    } else if (!data.location) {
        res.status(400).json({ error: 'missing required location' })
    } else if (!data.contact_info) {
        res.status(400).json({ error: 'missing required contact info' })
    } else {
        next();
    }
}

function validateLogin(req, res, next) {
    const data = req.body;
    if (!data) {
        res.status(400).json({ error: 'missing username and password' })
    } else if (!data.username) {
        res.status(400).json({ error: 'missing required username' })
    } else if (!data.password) {
        res.status(400).json({ error: 'missing required password' })
    } else {
        next();
    }
}

module.exports = router;

