const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

const getStudentGroup = require('./get.js');
const listStudentGroups = require('./list.js');

module.exports = (app) => {
  app.use('/student-groups*', auth);
  app.use('/student-groups*', epLogger);

  app.get('/student-groups', listStudentGroups);
  app.get('/student-groups/:id', getStudentGroup);
};
