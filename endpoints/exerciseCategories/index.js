const getExerciseCategories = require('./get.js');
const listExerciseCategories = require('./list.js');
const updateExerciseCategories = require('./update.js');

module.exports = (app) => {
  app.get('/exerciseCategories', listExerciseCategories);
  app.get('/exerciseCategories/:id', getExerciseCategories);
  app.patch('/exerciseCategories/:id', updateExerciseCategories);
};
