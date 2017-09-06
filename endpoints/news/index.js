const authPass = require('../../middlewares/auth-pass.js');
const epLogger = require('../../middlewares/ep-logger');

const addNews = require('./add.js');
const getNews = require('./get.js');
const listNews = require('./list.js');
const updateNews = require('./update.js');
const deleteNews = require('./delete.js');

module.exports = (app) => {
  app.use('/news*', authPass);
  app.use('/news*', epLogger);

  app.get('/news', listNews);
  app.get('/news/:id', getNews);
  app.delete('/news/:id', deleteNews);
  app.patch('/news/:id', updateNews);
  app.post('/news', addNews);
};
