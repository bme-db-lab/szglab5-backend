const getStudentRegistrations = require('./get.js');

module.exports = (app) => {
  app.get('/studentregistrations/:id', getStudentRegistrations);
};
