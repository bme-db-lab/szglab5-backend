const login = require('./login.js');
const loginShibboleth = require('./loginShibboleth');
const impersonate = require('./impersonate');
const verifyToken = require('./verify-token');
const auth = require('../../middlewares/auth.js');

const epLogger = require('../../middlewares/ep-logger');


module.exports = (app) => {
  app.use('/auth*', epLogger);

  app.get('/auth/loginshibboleth', loginShibboleth);
  app.post('/auth/login', login);
  app.post('/auth/impersonate', auth, impersonate);
  app.post('/auth/verify-token', verifyToken);
};
