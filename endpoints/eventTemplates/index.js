const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

const addEventTemplate = require('./add.js');
const deleteEventTemplate = require('./delete.js');
const getEventTemplate = require('./get.js');
const listEventTemplates = require('./list.js');
const listEventTemplatesSimple = require('./listSimple');
const updateEventTemplate = require('./update.js');
const generateDeliverables = require('./generateDeliverables.js');
const downloadHandouts = require('./downloadHandouts.js');

module.exports = (app) => {
  app.use('/event-templates*', epLogger);

  app.post('/event-templates/:id/listDownload.zip', downloadHandouts);

  app.use('/event-templates*', auth);

  app.delete('/event-templates/:id', deleteEventTemplate);
  app.get('/event-templates', listEventTemplates);
  app.get('/event-templates-simple', listEventTemplatesSimple);
  app.get('/event-templates/:id', getEventTemplate);
  app.patch('/event-templates/:id', updateEventTemplate);
  app.post('/event-templates', addEventTemplate);
  app.get('/event-templates/:id/generate-deliverables', generateDeliverables);
};
