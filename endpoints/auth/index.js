const login = require('./login.js');

module.exports = (app) => {
  app.post('/auth/login', login);
};
