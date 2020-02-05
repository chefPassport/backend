const db = require('../database/dbConfig.js');
const request = require('supertest');
const server = require('../api/server');
const Recipes = require('../recipes/recipes-model');
const Chefs = require('./chefs-model');


// ------------------- REGISTER ENDPOINT ---------------------- //
describe('Chefs Router', function() {
    beforeEach(async () => {
        await db('chefs').truncate();
    });

    describe('/register', function() {
        it ('should register a user', async function() {
            await request(server)
                .post('/api/chefs/register')
                .send({ username: 'User1', password: 'pass', name: 'Billy', location: 'Pennsylvania', contact_info: 'bgtest@gmail.com' })
                .expect(201);
        });

        it ('should NOT register a user', async function() {
            await request(server)
                .post('/api/chefs/register')
                .send({ username: 'User2' })
                .expect(400);
        });
    });
});



// ------------------- LOGIN ENDPOINT ---------------------- //
describe('Chefs Router', function() {
    describe('/login', function() {
        it ('should login a user', async function() {
            await request(server)
                .post('/api/chefs/register')
                .send({ username: 'User2', password: 'pass', name: 'Bobby', location: 'Virginia', contact_info: 'bgtest2@gmail.com' })
            await request(server)
                .post('/api/chefs/login')
                .send({ username: 'User2', password: 'pass' })
                .expect(200);
        });

        it ('should NOT login a user', async function() {
            await request(server)
                .post('/api/chefs/login')
                .send({ username: 'User5', password: 'pass' })
                .expect(401);
        });
    });
})

// ------------------- DELETE ENDPOINT ---------------------- //
describe('Recipes Model', function() {
    beforeEach(async () => {
        await db('recipes').truncate();
    });

    describe('remove()', function() {
        it ('should remove a recipe', async function() {
            await Recipes.addRecipe({ image: 'test url', recipe_title: 'test title', meal_type: 'test meal', ingredients: 'test ingredients', instructions: 'test instructions', chef_id: 1 });
            await Chefs.remove(1);

            const recipes = await db('recipes');
            expect(recipes).toHaveLength(0);
        });

        it ('should not remove recipe that does not exist', async function() {
            await Recipes.addRecipe({ image: 'test url1', recipe_title: 'test title1', meal_type: 'test meal1', ingredients: 'test ingredients1', instructions: 'test instructions1', chef_id: 1 });
            await Recipes.addRecipe({ image: 'test url2', recipe_title: 'test title2', meal_type: 'test meal2', ingredients: 'test ingredients2', instructions: 'test instructions2', chef_id: 1 });
            await Recipes.addRecipe({ image: 'test url3', recipe_title: 'test title3', meal_type: 'test meal3', ingredients: 'test ingredients3', instructions: 'test instructions3', chef_id: 1 });
            await Chefs.remove(5);

            const threeRecipes = await db('recipes');
            expect(threeRecipes).toHaveLength(3);
        });
    });
});
