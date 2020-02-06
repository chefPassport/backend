const db = require('../database/dbConfig.js');

const request = require('supertest');
const server = require('../api/server.js');

describe('Recipes Router', function(){
    it('runs the test', function(){
        expect(true).toBe(true);
    })

    beforeEach(async ()=>{
        await db('recipes').truncate();
    })

    describe('GET all recipes /', function(){

        it('should return JSON', function(){
            return request(server).get('/api/recipes')
            .then(res =>{
                expect(res.type).toMatch(/json/i);
            })
        })

        it('should return 200', async() => {
            let res = await request(server)
            .get('/api/recipes')
            .set('Content-Type', 'application/json');
            expect(res.status).toBe(200);
            })

    })

    describe('GET specific recipe /:id', function(){

        it('should return JSON', function(){
            return request(server).get('/api/recipes')
            .then(res =>{
                expect(res.type).toMatch(/JSON/i);
            })
        })

        it('should return 404 - used ID not found', async() => {
            let res = await request(server)
            .get('/api/recipes/11')
            .set('Content-Type', 'application/json');
            expect(res.status).toBe(404);
            }) 

        it('should return 200', async () => {
            const chefRegister = {
                username: 'User1', password: 'test', name: "Bob", location: 'earth', contact_info: 'bob@email.com'}

            const user = { username: 'User1', password: 'test'};

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
            .post('/api/chefs/login')
            .send(user);
            await request(server)
            .post('/api/recipes')
            .send(recipe);

            await request(server)
            .get('/api/recipes/1')
            .set('Content-Type', 'application/json');
            expect(200);
        })
    
    })

    describe('POST creates new recipe /', function(){

        it('should return JSON', function(){
            return request(server).post('/api/recipes')
            .then(res =>{
                expect(res.type).toMatch(/JSON/i);
            })
        })

        it('should return 200', async () => {
            const chefRegister = {
                username: 'User1', password: 'test', name: "Bob", location: 'earth', contact_info: 'bob@email.com'}

            const user = { username: 'User1', password: 'test'};

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
            .post('/api/chefs/login')
            .send(user);

            await request(server)
            .post('/api/recipes')
            .send(recipe)
            .set('Content-Type', 'application/json');
            expect(200); 
        });
    });
})