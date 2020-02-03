
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('recipes').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('recipes').insert([
        {recipe_title: 'PB&J Sandwich', image: 'https://images.unsplash.com/photo-1557275357-072087771588?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80', ingredients: 'tbsp of peanut butter, tbsp of jelly, and 2 slices of bread', instructions: 'Spread peanut butter on one slice of bread. Spread jelly on other. Combine and bam!', meal_type: 'Snack', chef_id: 1},
        {recipe_title: 'Scrambled eggs', image: 'https://images.unsplash.com/photo-1551185618-5d8656fd00b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2978&q=80', ingredients: '2 eggs, black pepper, and salt', instructions: 'Heat pan. Lightly coat pan with non-stick cooking spray. Beat eggs in bowl. Add a pinch of salt and pepper to taste. Add eggs to pan and stir. Heat until cooked. Enjoy.', meal_type: "Breakfast", chef_id: 1},
        {recipe_title: 'Grilled Cheese', image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2022&q=80', ingredients: '2 tbsp of butter, 2 slices of bread, 2 slices of American Cheese', instructions: 'Heat non-stick pan with butter. Place 1 slice of bread in buttered pan. Add cheese to bread. Close sandwich with one slice of bread. Flip when buttered side is golden brown. Remove when second slice of bread is golden brown.', meal_type: "Lunch", chef_id: 2},
        {recipe_title: 'Water', image: 'https://images.unsplash.com/photo-1534616042650-80f5c9b61f09?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1525&q=80', ingredients: 'water', instructions: 'Pour filterd water in glass cup. Add ice cubes if prefer cold.', meal_type: "Snack", chef_id: 3}
      ]);
    });
};
