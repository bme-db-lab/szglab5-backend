const addEventTemplate = require('./add.js');
const deleteEventTemplate = require('./delete.js');
const getEventTemplate = require('./get.js');
const listEventTemplates = require('./list.js');
const updateEventTemplate = require('./update.js');

module.exports = (app) => {
  app.delete('/event-templates/:id', deleteEventTemplate);
  app.get('/event-templates', listEventTemplates);
  app.get('/event-templates/:id', getEventTemplate);
  app.patch('/event-templates/:id', updateEventTemplate);
  app.post('/event-templates', addEventTemplate);
};