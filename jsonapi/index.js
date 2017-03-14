const sendResponseList = require('./sendResponseList.js');
const sendResponseGet = require('./sendResponseGet.js');

module.exports = (app) => {
  app.get('/:modelNamePlural', sendResponseList);
  app.get('/:modelNamePlural/:id', sendResponseGet);
};
