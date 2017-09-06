const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

const getExerciseCategories = require('./get.js');
const getQuestions = require('./getQuestions.js');
const listExerciseCategories = require('./list.js');
const updateExerciseCategories = require('./update.js');

module.exports = (app) => {
  app.use('/exercise-categories*', auth);
  app.use('/exercise-categories*', epLogger);

  app.get('/exercise-categories', listExerciseCategories);
  app.get('/exercise-categories/:id', getExerciseCategories);
  app.get('/exercise-categories/:id/questions', getQuestions);
  app.patch('/exercise-categories/:id', updateExerciseCategories);
};
