const getExerciseSheet = require('./get.js');
const listExerciseSheets = require('./list.js');

module.exports = (app) => {
  app.get('/exercise-sheets', listExerciseSheets);
  app.get('/exercise-sheets/:id', getExerciseSheet);
};
