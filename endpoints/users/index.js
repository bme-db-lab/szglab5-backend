const auth = require('../../middlewares/auth.js');
const getUser = require('./get.js');

module.exports = (app) => {
  app.use('/users/*', auth);
  app.get('/users/:id', getUser);
};
