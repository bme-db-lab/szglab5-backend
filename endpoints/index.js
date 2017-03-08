const testList = require('./test/list.js');
const testCreate = require('./test/create.js');

const testQuestionList = require('./testQuestion/list.js');

module.exports = (app) => {
  app.get('/test/list', testList);
  app.get('/testQuestion/list', testQuestionList);
  app.post('/test/create', testCreate);
};
