const getExerciseCategories = require('./get.js');
const listExerciseCategories = require('./list.js');
const updateExerciseCategories = require('./update.js');

module.exports = (app) => {
  app.get('/exercise-categories', listExerciseCategories);
  app.get('/exercise-categories/:id', getExerciseCategories);
  app.patch('/exercise-categories/:id', updateExerciseCategories);
};
