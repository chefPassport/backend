
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('chefs').del()
    .then(function () {
      // Inserts seed entries
      return knex('chefs').insert([
        {id: 1, name: 'Jim Smith', username: 'user1', password: 'user1test123', location: 'Pittsburgh, PA', contact_info: 'jsmithchef@gmail.com'},
        {id: 2, name: 'Sara Jones', username: 'user2', password: 'user2test123', location: 'Cleveland, OH', contact_info: 'sjoneschef@gmail.com'},
        {id: 3, name: 'Kelly Johnson', username: 'user3', password: 'user3test123', location: 'New York, NY', contact_info: 'kjohnsonchef@gmail.com'},
      ]);
    });
};
