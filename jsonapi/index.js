const sendResponseList = require('./sendResponseList.js');
const sendResponseGet = require('./sendResponseGet.js');
const sendResponseCreate = require('./sendResponseCreate.js');
const sendResponseDelete = require('./sendResponseDelete.js');
const sendResponseUpdate = require('./sendResponseUpdate.js');

module.exports = (app) => {
  app.get('/:modelNamePlural', sendResponseList);
  app.get('/:modelNamePlural/:id', sendResponseGet);
  app.post('/:modelNamePlural', sendResponseCreate);
  app.delete('/:modelNamePlural/:id', sendResponseDelete);
  app.patch('/:modelNamePlural/:id', sendResponseUpdate);
};
