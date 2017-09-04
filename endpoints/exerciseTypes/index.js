const getExerciseTypes = require('./get.js');
const listExerciseTypes = require('./list.js');
const updateExerciseTypes = require('./update.js');
const auth = require('../../middlewares/auth.js');

module.exports = (app) => {
  app.use('/exercise-types*', auth);
  app.get('/exercise-types', listExerciseTypes);
  app.get('/exercise-types/:id', getExerciseTypes);
  app.patch('/exercise-types/:id', updateExerciseTypes);
};
