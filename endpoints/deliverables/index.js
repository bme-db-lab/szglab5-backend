const auth = require('../../middlewares/auth.js');
const getDeliverables = require('./get.js');
const updateDeliverables = require('./update.js');

module.exports = (app) => {
  app.use('/deliverables/*', auth);
  app.get('/deliverables/:id', getDeliverables);
  app.patch('/deliverables/:id', updateDeliverables);
};
