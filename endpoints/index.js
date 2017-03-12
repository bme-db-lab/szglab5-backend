const testEndpoints = require('./test');
const questionEndpoints = require('./question');
const questionTypeEndpoints = require('./questiontype');

module.exports = (app) => {
  testEndpoints(app);
  questionEndpoints(app);
  questionTypeEndpoints(app);
};
