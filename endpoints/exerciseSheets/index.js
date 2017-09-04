const getExerciseSheet = require('./get.js');
const listExerciseSheets = require('./list.js');
const auth = require('../../middlewares/auth.js');

module.exports = (app) => {
  app.use('/exercise-sheets*', auth);
  app.get('/exercise-sheets', listExerciseSheets);
  app.get('/exercise-sheets/:id', getExerciseSheet);
};
