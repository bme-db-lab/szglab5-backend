const auth = require('../../middlewares/auth.js');
const getEvents = require('./get.js');
const getEventDemonstrator = require('./getDemonstrator.js');

module.exports = (app) => {
  app.use('/events/*', auth);
  app.get('/events/:id', getEvents);
  app.get('/events/:id/demonstrator', getEventDemonstrator);
};
