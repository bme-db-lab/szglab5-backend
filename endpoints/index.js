const authEndpoints = require('./auth');
const usersEndpoints = require('./users');

module.exports = (app) => {
  authEndpoints(app);
  usersEndpoints(app);
};
