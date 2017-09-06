const runsql = require('./runsql.js');

const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

module.exports = (app) => {
  app.use('/sql', auth);
  app.use('/sql', epLogger);

  app.post('/sql', runsql);
};
