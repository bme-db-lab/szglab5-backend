const authEndpoints = require('./auth');
const usersEndpoints = require('./users');
const studentregistrations = require('./studentRegistrations');
const events = require('./events');

module.exports = (app) => {
  authEndpoints(app);
  usersEndpoints(app);
  studentregistrations(app);
  events(app);
};
