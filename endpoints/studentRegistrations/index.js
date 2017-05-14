const auth = require('../../middlewares/auth.js');
const getStudentRegistrations = require('./get.js');

module.exports = (app) => {
  app.use('/student-registrations/*', auth);
  app.get('/student-registrations/:id', getStudentRegistrations);
};
