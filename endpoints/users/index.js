const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

const getUser = require('./get.js');
const updateUser = require('./update.js');
const listUsers = require('./list.js');
const addUser = require('./add.js');

module.exports = (app) => {
  app.use('/users*', auth);
  app.use('/users*', epLogger);

  app.get('/users/:id', getUser);
  app.get('/users', listUsers);
  app.patch('/users/:id', updateUser);
  app.post('/users', addUser);
};
