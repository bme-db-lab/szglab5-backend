const getEvents = require('./get.js');

module.exports = (app) => {
  app.get('/events/:id', getEvents);
};
