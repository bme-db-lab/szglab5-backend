const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

const getRoles = require('./get.js');
const listRoles = require('./list.js');

module.exports = (app) => {
  app.use('/roles*', auth);
  app.use('/roles*', epLogger);

  app.get('/roles', listRoles);
  app.get('/roles/:id', getRoles);
};
