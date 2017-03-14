const testList = require('./methods/list.js');
const testGet = require('./methods/get.js');
const testCreate = require('./methods/create.js');
const testDelete = require('./methods/delete.js');
const testUpdate = require('./methods/update.js');
const testRelations = require('./methods/relations.js');

module.exports = (app) => {
  app.get('/tests', testList);
  app.get('/tests/:id', testGet);
  app.get('/tests/:id/:type', testRelations);
  app.post('/tests', testCreate);
  app.delete('/tests/:id', testDelete);
  app.patch('/tests/:id', testUpdate);
};
