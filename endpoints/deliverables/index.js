const auth = require('../../middlewares/auth.js');
const getDeliverables = require('./get.js');

module.exports = (app) => {
  app.use('/deliverables/*', auth);
  app.get('/deliverables/:id', getDeliverables);
};
