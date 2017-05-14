const getExerciseTypes = require('./get.js');
const listExerciseTypes = require('./list.js');
const updateExerciseTypes = require('./update.js');

module.exports = (app) => {
  app.get('/exercise-types', listExerciseTypes);
  app.get('/exercise-types/:id', getExerciseTypes);
  app.patch('/exercise-types/:id', updateExerciseTypes);
};
