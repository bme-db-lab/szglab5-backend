const testList = require('./list.js');
const testCreate = require('./create.js');

module.exports = (app) => {
  app.get('/test/list', testList);
  app.post('/test/create', testCreate);
};
