const auth = require('../../middlewares/auth.js');
const getUser = require('./get.js');
const updateUser = require('./update.js');

module.exports = (app) => {
  app.use('/users/*', auth);
  app.get('/users/:id', getUser);
  app.patch('/users/:id', updateUser);
};
