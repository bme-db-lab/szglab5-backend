const addTestQuestion = require('./add.js');
const deleteTestQuestion = require('./delete.js');
const getTestQuestion = require('./get.js');
const listTestQuestions = require('./list.js');
const updateTestQuestion = require('./update.js');

module.exports = (app) => {
  app.delete('/test-questions/:id', deleteTestQuestion);
  app.get('/test-questions', listTestQuestions);
  app.get('/test-questions/:id', getTestQuestion);
  app.patch('/test-questions/:id', updateTestQuestion);
  app.post('/test-questions', addTestQuestion);
};
