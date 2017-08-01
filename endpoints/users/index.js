const auth = require('../../middlewares/auth.js');
const getUser = require('./get.js');
const updateUser = require('./update.js');
const listUsers = require('./list.js');
const addUser = require('./add.js');

module.exports = (app) => {
  app.use('/users*', auth);
  app.get('/users/:id', getUser);
  app.get('/users', listUsers);
  app.patch('/users/:id', updateUser);
  app.post('/users', addUser);
};
