const auth = require('../../middlewares/auth.js');
const getDeliverableTemplates = require('./get.js');

module.exports = (app) => {
  app.use('/deliverabletemplates/*', auth);
  app.get('/deliverabletemplates/:id', getDeliverableTemplates);
};
