const authEndpoints = require('./auth');
const usersEndpoints = require('./users');
const deliverables = require('./deliverables');
const deliverabletemplates = require('./deliverableTemplates');
const events = require('./events');
const eventtemplates = require('./eventTemplates');
const exercisecategories = require('./exerciseCategories');
const exercisetypes = require('./exerciseTypes');
const studentregistrations = require('./studentRegistrations');
const questionEndpoints = require('./questions');
const sqlEndpoints = require('./sql');
const newsEndpoints = require('./news');
const languageEndpoints = require('./languages');

module.exports = (app) => {
  authEndpoints(app);
  usersEndpoints(app);
  deliverables(app);
  deliverabletemplates(app);
  events(app);
  eventtemplates(app);
  exercisecategories(app);
  exercisetypes(app);
  studentregistrations(app);
  questionEndpoints(app);
  sqlEndpoints(app);
  newsEndpoints(app);
  languageEndpoints(app);
};
