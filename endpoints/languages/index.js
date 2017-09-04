const getLangugaes = require('./get.js');
const listLanguages = require('./list.js');
const auth = require('../../middlewares/auth.js');

module.exports = (app) => {
  app.use('/languages*', auth);
  app.get('/languages/:id', getLangugaes);
  app.get('/languages', listLanguages);
};
