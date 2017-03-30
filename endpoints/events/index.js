const auth = require('../../middlewares/auth.js');
const getEvents = require('./get.js');

module.exports = (app) => {
  app.use('/events/*', auth);
  app.get('/events/:id', getEvents);
};
