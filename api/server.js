const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const recipeRouter = require('../recipes/recipes-router.js');
const chefRouter = require('../chefs/chefs-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/docs', express.static('./docs'));
server.use('/api/recipes', recipeRouter);
server.use('/api/chefs', chefRouter);

server.get('/', (req, res) => {
    res.status(200).json('Chef Portfolio');
});

module.exports = server;