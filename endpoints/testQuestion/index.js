const questionList = require('./list.js');
const questionCreate = require('./create.js');

module.exports = (app) => {
  app.get('/testQuestion/list', questionList);
  app.post('/testQuestion/create', questionCreate);
};
