const login = require('./login.js');
const impersonate = require('./impersonate');
const verifyToken = require('./verify-token');

const epLogger = require('../../middlewares/ep-logger');


module.exports = (app) => {
  app.use('/auth*', epLogger);

  app.post('/auth/login', login);
  app.post('/auth/impersonate', impersonate);
  app.post('/auth/verify-token', verifyToken);
};
