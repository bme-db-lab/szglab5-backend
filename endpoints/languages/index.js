const getLangugaes = require('./get.js');
const listLanguages = require('./list.js');

module.exports = (app) => {
  app.get('/languages/:id', getLangugaes);
  app.get('/languages', listLanguages);
};
