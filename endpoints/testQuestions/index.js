const addTestQuestion = require('./add.js');
const deleteTestQuestions = require('./delete.js');
const getTestQuestions = require('./get.js');
const listTestQuestions = require('./list.js');
const updateTestQuestions = require('./update.js');

module.exports = (app) => {
  app.delete('/testQuestions/:id', deleteTestQuestions);
  app.get('/testQuestions', listTestQuestions);
  app.get('/testQuestions/:id', getTestQuestions);
  app.patch('/testQuestions/:id', updateTestQuestions);
  app.post('/testQuestions', addTestQuestion);
};
