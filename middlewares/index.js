const postReqValidator = require('./postReqValidator');
const epLogger = require('./ep-logger.js');

module.exports = (app) => {
  postReqValidator(app);
  app.use('*', epLogger);
};
