const auth = require('../../middlewares/auth.js');
const getDeliverableTemplates = require('./get.js');

module.exports = (app) => {
  app.use('/deliverable-templates/*', auth);
  app.get('/deliverable-templates/:id', getDeliverableTemplates);
};
