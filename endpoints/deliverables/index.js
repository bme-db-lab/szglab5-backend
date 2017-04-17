const auth = require('../../middlewares/auth.js');
const getDeliverables = require('./get.js');
const getDeliverableCorrector = require('./getCorrector.js');
const updateDeliverables = require('./update.js');

module.exports = (app) => {
  app.use('/deliverables/*', auth);
  app.get('/deliverables/:id', getDeliverables);
  app.get('/deliverables/:id/corrector', getDeliverableCorrector);
  app.patch('/deliverables/:id', updateDeliverables);
};
