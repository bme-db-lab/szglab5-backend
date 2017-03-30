const authEndpoints = require('./auth');
const usersEndpoints = require('./users');
const studentregistrations = require('./studentRegistrations');
const events = require('./events');
const deliverables = require('./deliverables');
const deliverabletemplates = require('./deliverableTemplates');

module.exports = (app) => {
  authEndpoints(app);
  usersEndpoints(app);
  studentregistrations(app);
  events(app);
  deliverables(app);
  deliverabletemplates(app);
};
