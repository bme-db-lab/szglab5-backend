const getLangugaes = require('./get.js');
const listLanguages = require('./list.js');

const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

module.exports = (app) => {
  app.use('/languages*', auth);
  app.use('/languages*', epLogger);

  app.get('/languages/:id', getLangugaes);
  app.get('/languages', listLanguages);
};
