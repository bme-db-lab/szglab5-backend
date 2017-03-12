const questionList = require('./methods/list.js');
const questionGet = require('./methods/get.js');
const questionCreate = require('./methods/create.js');
const questionDelete = require('./methods/delete.js');

module.exports = (app) => {
  app.get('/questions', questionList);
  app.get('/questions/:id', questionGet);
  app.post('/questions', questionCreate);
  app.delete('/questions/:id', questionDelete);
};
