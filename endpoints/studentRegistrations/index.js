const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

const getStudentRegistrations = require('./get.js');
const listStudentRegistrations = require('./list.js');

module.exports = (app) => {
  app.use('/student-registrations/*', auth);
  app.use('/student-registrations/*', epLogger);

  app.get('/student-registrations', listStudentRegistrations);
  app.get('/student-registrations/:id', getStudentRegistrations);
};
