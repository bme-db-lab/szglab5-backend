const auth = require('../../middlewares/auth.js');
const getDeliverables = require('./get.js');
const getDeliverableCorrector = require('./getCorrector.js');
const getDeliverableTemplate = require('./getTemplate.js');
const getDeliverableStudent = require('./getStudent.js');
const listDeliverables = require('./list.js');
const updateDeliverables = require('./update.js');

module.exports = (app) => {
  app.use('/deliverables/*', auth);
  app.get('/deliverables/:id', getDeliverables);
  app.get('/deliverables/:id/corrector', getDeliverableCorrector);
  app.get('/deliverables/:id/template', getDeliverableTemplate);
  app.get('/deliverables/:id/student', getDeliverableStudent);
  app.get('/deliverables', listDeliverables);
  app.patch('/deliverables/:id', updateDeliverables);
};
