const getEvents = require('./get.js');
const getEventDemonstrator = require('./getDemonstrator.js');
const listEvents = require('./list.js');

module.exports = (app) => {
  app.get('/events/:id', getEvents);
  app.get('/events/:id/demonstrator', getEventDemonstrator);
  app.get('/events', listEvents);
};
