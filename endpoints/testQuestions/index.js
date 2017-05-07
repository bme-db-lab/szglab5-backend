const addTestQuestion = require('./add.js');
const deleteTestQuestion = require('./delete.js');
const getTestQuestion = require('./get.js');
const listTestQuestions = require('./list.js');
const updateTestQuestion = require('./update.js');

module.exports = (app) => {
  app.delete('/testQuestions/:id', deleteTestQuestion);
  app.get('/testQuestions', listTestQuestions);
  app.get('/testQuestions/:id', getTestQuestion);
  app.patch('/testQuestions/:id', updateTestQuestion);
  app.post('/testQuestions', addTestQuestion);
};
