const getExerciseSheet = require('./get.js');
const listExerciseSheets = require('./list.js');

const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

module.exports = (app) => {
  app.use('/exercise-sheets*', auth);
  app.use('/exercise-sheets*', epLogger);

  app.get('/exercise-sheets', listExerciseSheets);
  app.get('/exercise-sheets/:id', getExerciseSheet);
};
