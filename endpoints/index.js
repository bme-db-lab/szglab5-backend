const testEndpoints = require('./test');
const testQuestionEndpoints = require('./testQuestion');

module.exports = (app) => {
  testEndpoints(app);
  testQuestionEndpoints(app);
};
