const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

const getSemester = require('./get.js');
const listSemester = require('./list.js');

module.exports = (app) => {
  app.use('/semesters*', auth);
  app.use('/semesters*', epLogger);

  app.get('/semesters', listSemester);
  app.get('/semesters/:id', getSemester);
};
