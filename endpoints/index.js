const testList = require('./test/list.js');

const testQuestionList = require('./testQuestion/list.js');

module.exports = (app) => {
  app.get('/test/list', testList);
  app.get('/testQuestion/list', testQuestionList);
};
