const addQuestion = require('./add.js');
const deleteQuestion = require('./delete.js');
const getQuestion = require('./get.js');
const listQuestions = require('./list.js');
const updateQuestions = require('./update.js');
const generatePDF = require('./generatePDF.js');

const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

module.exports = (app) => {
  app.use('/questions*', auth);
  app.use('/questions*', epLogger);

  app.get('/questions', listQuestions);
  app.get('/questions/:id', getQuestion);
  app.get('/generatePDF', generatePDF);
  app.delete('/questions/:id', deleteQuestion);
  app.patch('/questions/:id', updateQuestions);
  app.post('/questions', addQuestion);
};
