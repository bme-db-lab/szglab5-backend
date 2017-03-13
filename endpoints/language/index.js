const languageList = require('./list.js');

module.exports = (app) => {
  app.get('/languages', languageList);
};
