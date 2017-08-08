const auth = require('../../middlewares/auth.js');
const getStudentRegistrations = require('./get.js');
const listStudentRegistrations = require('./list.js');

module.exports = (app) => {
  app.use('/student-registrations/*', auth);
  app.get('/student-registrations', listStudentRegistrations);
  app.get('/student-registrations/:id', getStudentRegistrations);
};
