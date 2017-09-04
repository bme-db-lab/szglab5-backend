const runsql = require('./runsql.js');
const auth = require('../../middlewares/auth.js');

module.exports = (app) => {
  app.use('/sql', auth);
  app.post('/sql', runsql);
};
