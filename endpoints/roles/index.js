const auth = require('../../middlewares/auth.js');
const getNews = require('./get.js');
const listNews = require('./list.js');

module.exports = (app) => {
  app.use('/roles*', auth);
  app.get('/roles', listNews);
  app.get('/roles/:id', getNews);
};
