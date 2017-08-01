const login = require('./login.js');
const impersonate = require('./impersonate');

module.exports = (app) => {
  app.post('/auth/login', login);
  app.post('/auth/impersonate', impersonate);
};
