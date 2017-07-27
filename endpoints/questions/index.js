const addQuestion = require('./add.js');
const deleteQuestion = require('./delete.js');
const getQuestion = require('./get.js');
const listQuestions = require('./list.js');
const updateQuestions = require('./update.js');

module.exports = (app) => {
  app.get('/questions', listQuestions);
  app.get('/questions/:id', getQuestion);
  app.delete('/questions/:id', deleteQuestion);
  app.patch('/questions/:id', updateQuestions);
  app.post('/questions', addQuestion);
};
