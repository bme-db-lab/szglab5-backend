const auth = require('../../middlewares/auth.js');
const getExerciseCategories = require('./get.js');
const getQuestions = require('./getQuestions.js');
const listExerciseCategories = require('./list.js');
const updateExerciseCategories = require('./update.js');

module.exports = (app) => {
  app.use('/exercise-categories*', auth);
  app.get('/exercise-categories', listExerciseCategories);
  app.get('/exercise-categories/:id', getExerciseCategories);
  app.get('/exercise-categories/:id/questions', getQuestions);
  app.patch('/exercise-categories/:id', updateExerciseCategories);
};
