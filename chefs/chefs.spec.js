const db = require('../database/dbConfig.js');
const request = require('supertest');
const server = require('../api/server');


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

// ------------------- Specific Chef's Recipes ENDPOINT ---------------------- //

describe('Chefs Router', function(){

    it('runs the test', function(){
        expect(true).toBe(true);
    })

    beforeEach(async ()=>{
        await db('chefs').truncate();
    })

    describe('GET all recipes for specific chef', function(){

        it('should return JSON', function(){
            return request(server).get('/api/chefs/:id/recipes')
            .then(res =>{
                expect(res.type).toMatch(/JSON/i);
            })
        })

        it('should return 200', async() => {

            const chefRegister = {
            username: 'User1', password: 'test', name: "Bob", location: 'earth', contact_info: 'bob@email.com'}
            
            const recipe = {
                recipe_title: "Chocolate Milk 2.0",
                image: "https://images.unsplash.com/photo-1554654402-d506f91a1a64?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",
                ingredients: "Chocolate syrup, 1 cup of milk",
                instructions: "Mix chocolate syrup with cold milk and stir",
                meal_type: "Snack",
                chef_id: 1
            }

            await request(server)
            .post('/api/chefs/register')
            .send(chefRegister);

            await request(server)
            .post('/api/recipes')
            .send(recipe)
            .set('Content-Type', 'application/json');

            let res = await request(server)
            .get('/api/chefs/1/recipes')
            .set('Content-Type', 'application/json');
            expect(res.status).toBe(200);
            })

    })
});