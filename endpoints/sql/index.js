const runsql = require('./runsql.js');

module.exports = (app) => {
  app.post('/sql', runsql);
};
