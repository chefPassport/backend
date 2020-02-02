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
