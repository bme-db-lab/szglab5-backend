// const getGroupStatistics = require('./getGroupStatistics.js');
// const getStudentStatistics = require('./getStudentStatistics.js');
// const getUngradedDeliverables = require('./getUngradedDeliverables.js');
const getDeliverablesStatistics = require('./getDeliverablesStatistics.js');
const getEventsStatistics = require('./getEventsStatistics.js');
const getCorrectorsStatistics = require('./getCorrectorStatistics.js');

const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

module.exports = (app) => {
  app.get('/statistics*', auth);
  app.get('/statistics*', epLogger);

  app.get('/statistics/deliverables', getDeliverablesStatistics);
  app.get('/statistics/events', getEventsStatistics);
  app.get('/statistics/correctors', getCorrectorsStatistics);
  // app.get('/statistics/student', getStudentStatistics);
  // app.get('/statistics/group', getGroupStatistics);
  // app.get('/statistics/corrector', getCorrectorStatistics);
  // app.get('/statistics/ungraded', getUngradedDeliverables);
};
