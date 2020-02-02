const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require('jsonwebtoken');
const authenticate = require('../auth/authenticate-middleware');
const router = express.Router();


const Chefs = require('./chefs-model');


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


// GET POSTS FOR CHEF
router.get('/:id/posts', authenticate, validateChefId, (req, res) => {
    const id = req.params.id;

    Chefs.getChefPosts(id)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        res.status(500).json({ errorMessage: 'Failed to get posts' })
    })
});


// ADD POST FOR CHEF
router.post('/:id/posts', authenticate, validateChefId, validatePost, (req, res) => {
    const id = req.params.id;
    req.body.chef_id = id;
    const postData = req.body;

    Chefs.addPost(postData)
    .then(post => {
        res.status(201).json(post);
    })
    .catch(error => {
        res.status(500).json({ errorMessage: 'Failed to add post' })
    })
})



// ---------- Function for creating and signing token ----------- //

function signToken(user) {
    const payload = {
      username: user.username
    };
  
    const secret = process.env.JWT_SECRET || "super secret code";
  
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


function validatePost(req, res, next) {
    const data = req.body;
    if (!data) {
        res.status(400).json({ error: 'missing data' })
    } else if (!data.title) {
        res.status(400).json({ error: 'missing required title' })
    } else if (!data.meal_type) {
        res.status(400).json({ error: 'missing required meal type' })
    } else if (!data.ingredients) {
        res.status(400).json({ error: 'missing required ingredients' })
    } else if (!data.instructions) {
        res.status(400).json({ error: 'missing required instructions' })
    } else {
        next();
    }
}

module.exports = router;