const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

const getDeliverableTemplates = require('./get.js');
const updateDeliverableTemplates = require('./update.js');

module.exports = (app) => {
  app.use('/deliverable-templates*', auth);
  app.use('/deliverable-templates*', epLogger);

  app.get('/deliverable-templates/:id', getDeliverableTemplates);
  app.patch('/deliverable-templates/:id', updateDeliverableTemplates);
};
