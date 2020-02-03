
const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require('jsonwebtoken');
const authenticate = require('../auth/authenticate-middleware');
const router = express.Router();


const Chefs = require('./chefs-model');

/**
 * @api {post} /api/chefs/register Register User
 * @apiName RegisterUser
 * @apiGroup Chefs
 *
 * @apiParam {String} name Chef name
 * @apiParam {String} username Chef username
 * @apiParam {String} password Chef password
 * @apiParam {String} location Chef location
 * @apiParam {String} contact_info Chef contact info
 *
 * @apiSuccess {integer} id Chef id
 * @apiSuccess {String} name Chef name
 * @apiSuccess {String} username Chef username
 * @apiSuccess {String} password  Chef password
 * @apiSuccess {String} location Chef location
 * @apiSuccess {String} contact_info Chef contact info
 * 
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 201 Created
 * {
    "id": 1,
    "name": "Bob Smith",
    "username": "bgingrichtest",
    "password": "password1234",
    "location": "Pittsburgh, PA",
    "contact_info": "bgingrichchef@gmail.com"
*   }
 */

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

/**
 * @api {post} /api/chefs/login Login User
 * @apiName LoginUser
 * @apiGroup Chefs
 *
 * @apiParam {String} username Chef username
 * @apiParam {String} password Chef password
 *
 * @apiSuccess {string} SuccessMessage user logged in success message
 * @apiSuccess {String} token JSON Web Token
 * @apiSuccess {integer} id Chef id
 * 
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
    "message": "bgingrichtest Logged In!",
    "token": "asdfasdfasdfasdf.eyJ1c2VybmFtZSI6ImJnaW5ncmljaHRlc3QiLCJpYXQiOjE1ODA3NTQxMzIsImV4cCI6MTU4MDc4MjkzMn0.XVst-ijFdUzZGXhfZOYnjRvK-JHHXzOPA9_zOzpG1J0",
    "id": 1
*   }
 */

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

// PUT (Edit) specific recipe /api/chefs/recipes/:id

/**
 * @api {put} /api/chefs/:id/recipes/:id Update Recipe
 * @apiName UpdateRecipe
 * @apiGroup Recipes
 *
 * @apiParam {String} recipe_title Recipe title
 * @apiParam {String} image Recipe image URL
 * @apiParam {String} ingredients Recipe ingredients
 * @apiParam {String} instructions Recipe instructions
 * @apiParam {String} meal_type Recipe meal type
 * @apiParam {String} chef_id Recipe chef id
 *
 * @apiSuccess {String} recipe_title Recipe title
 * @apiSuccess {String} image Recipe image URL
 * @apiSuccess {String} ingredients Recipe ingredients
 * @apiSuccess {String} instructions Recipe instructions
 * @apiSuccess {String} meal_type Recipe meal type
 * @apiSuccess {String} chef_id Recipe chef id
 * 
 * 
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
    "recipe_title": "Lobster Bisque",
    "image": "images.google.com/12345",
    "ingredients": "butter, lobster, broth, salt, pepper",
    "instructions": "Mix all ingredients together in pot on medium heat",
    "meal_type": "Dinner",
    "chef_id": 1
*   }
 */

router.put('/:id/recipes/:id', authenticate, (req, res) => {
    const id = req.params.id;
    const recipeData = req.body;
    Chefs.update(id, recipeData)
    .then(recipe => {
        res.status(200).json(recipe);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ error: 'The recipe could not be modified.' })
    })
});

/**
 * @api {delete} /api/chefs/:id/recipes/:id Delete Recipe
 * @apiName DeleteRecipe
 * @apiGroup Recipes
 *
 * @apiParam {Integer} recipe_id Recipe id
 *
 * @apiSuccess {String} message Recipe deleted
 * 
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
    "message": "Deleted recipe"
*   }
 */

// DELETE specific recipe /api/chefs/recipes/:id
router.delete('/:id/recipes/:id', authenticate, (req, res) => {
    const id = req.params.id;
    Chefs.remove(id)
    .then(deleted => {
        if (deleted) {
            res.status(200).json({message: 'Deleted recipe'});
        } else {
            res.status(404).json({ message: 'Could not find recipe with that id' });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: 'Failed to delete post' });
    })
})

// ---------- Function for creating and signing token ----------- //

function signToken(user) {
    const payload = {
      username: user.username
    };
  
    const secret = process.env.JWT_SECRET || "secret code";
  
    const options = {
      expiresIn: "8h",
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

function validateChefId(req, res, next) {
    const id = req.params.id;
      Chefs.getChefById(id) 
      .then(chef => {
          if (chef) {
              req.chef = chef;
              next();
          } else {
              res.status(404).json({ message: 'invalid chef id' })
          }
      })
      .catch(error => {
            res.status(500).json({ error: 'The chef information could not be retrieved.' })
      })   
}

module.exports = router;

