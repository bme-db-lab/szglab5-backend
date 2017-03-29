const authEndpoints = require('./auth');

module.exports = (app) => {
  authEndpoints(app);
};
