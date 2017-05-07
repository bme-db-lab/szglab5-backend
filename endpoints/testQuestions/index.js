const addTestQuestion = require('./add.js');
const getTestQuestions = require('./get.js');
const listTestQuestions = require('./list.js');
const updateTestQuestions = require('./update.js');

module.exports = (app) => {
  app.get('/testQuestions', listTestQuestions);
  app.get('/testQuestions/:id', getTestQuestions);
  app.patch('/testQuestions/:id', updateTestQuestions);
  app.put('/testQuestions', addTestQuestion);
};
