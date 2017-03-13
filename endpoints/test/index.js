const testList = require('./methods/list.js');
const testGet = require('./methods/get.js');
const testCreate = require('./methods/create.js');
const testDelete = require('./methods/delete.js');
const testUpdate = require('./methods/update.js');

module.exports = (app) => {
  app.get('/tests', testList);
  app.get('/tests/:id', testGet);
  app.post('/tests', testCreate);
  app.delete('/tests/:id', testDelete);
  app.patch('/tests/:id', testUpdate);
};
