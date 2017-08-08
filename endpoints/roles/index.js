const auth = require('../../middlewares/auth.js');
const getRoles = require('./get.js');
const listRoles = require('./list.js');

module.exports = (app) => {
  app.use('/roles*', auth);
  app.get('/roles', listRoles);
  app.get('/roles/:id', getRoles);
};
