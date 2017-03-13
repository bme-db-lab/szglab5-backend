const testEndpoints = require('./test');
const questionEndpoints = require('./question');
const languageEndpoints = require('./language');

module.exports = (app) => {
  testEndpoints(app);
  questionEndpoints(app);
  languageEndpoints(app);
};
