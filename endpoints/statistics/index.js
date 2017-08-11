const getGroupStatistics = require('./getGroupStatistics.js');
const getStudentStatistics = require('./getStudentStatistics.js');
const auth = require('../../middlewares/auth.js');

module.exports = (app) => {
  app.get('/statistics*', auth);
  app.get('/statistics/student', getStudentStatistics);
  app.get('/statistics/group', getGroupStatistics);
};
