const auth = require('../../middlewares/auth.js');
const getStudentGroup = require('./get.js');
const listStudentGroups = require('./list.js');

module.exports = (app) => {
  app.use('/student-groups*', auth);
  app.get('/student-groups', listStudentGroups);
  app.get('/student-groups/:id', getStudentGroup);
};
