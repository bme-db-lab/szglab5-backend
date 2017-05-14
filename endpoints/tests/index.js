const addTest = require('./add.js');
const deleteTest = require('./delete.js');
const getTest = require('./get.js');
const listTests = require('./list.js');
const updateTest = require('./update.js');

module.exports = (app) => {
  app.delete('/tests/:id', deleteTest);
  app.get('/tests', listTests);
  app.get('/tests/:id', getTest);
  app.patch('/tests/:id', updateTest);
  app.post('/tests', addTest);
};
