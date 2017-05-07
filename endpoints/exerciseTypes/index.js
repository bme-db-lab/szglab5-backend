const getExerciseTypes = require('./get.js');
const listExerciseTypes = require('./list.js');
const updateExerciseTypes = require('./update.js');

module.exports = (app) => {
  app.get('/exerciseTypes', listExerciseTypes);
  app.get('/exerciseTypes/:id', getExerciseTypes);
  app.patch('/exerciseTypes/:id', updateExerciseTypes);
};
