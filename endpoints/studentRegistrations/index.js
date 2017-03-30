const auth = require('../../middlewares/auth.js');
const getStudentRegistrations = require('./get.js');

module.exports = (app) => {
  app.use('/studentregistrations/*', auth);
  app.get('/studentregistrations/:id', getStudentRegistrations);
};
