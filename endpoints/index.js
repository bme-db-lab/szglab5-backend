const authEndpoints = require('./auth');
const usersEndpoints = require('./users');
const deliverables = require('./deliverables');
const deliverabletemplates = require('./deliverableTemplates');
const events = require('./events');
const exercisecategories = require('./exerciseCategories');
const exercisetypes = require('./exerciseTypes');
const studentregistrations = require('./studentRegistrations');

module.exports = (app) => {
  authEndpoints(app);
  usersEndpoints(app);
  deliverables(app);
  deliverabletemplates(app);
  events(app);
  exercisecategories(app);
  exercisetypes(app);
  studentregistrations(app);
};
