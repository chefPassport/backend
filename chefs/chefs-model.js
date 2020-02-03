const db = require('../database/dbConfig');

module.exports = {
    add,
    findBy,
    getChefById,
    getChefPosts,
    addPost
}


function add(chef) {
    return db('chefs')
        .insert(chef, 'id')
        .then(ids => {
            const [id] = ids;
            return db('chefs')
                .where({ id })
                .first();
        })
}

function findBy(username) {
    return db('chefs')
        .where(username)
        .first();
}

function getChefById(id) {
    return db('chefs')
        .where({ id })
        .first();
}

function getChefPosts(id) {
    return db('posts as p')
        .select('p.id', 'p.image_url', 'p.title', 'p.meal_type', 'p.ingredients', 'p.instructions', 'p.chef_id', 'c.name', 'c.location', 'c.contact_info')
        .join('chefs as c', 'p.chef_id', '=', 'c.id')
        .where('p.chef_id', id);
}

function addPost(post) {
    return db('posts')
        .insert(post, 'id')
        .then(ids => {
            const [id] = ids;

            return db('posts')
                .where({ id })
                .first();
        })
}