const postReqValidator = require('./postReqValidator');

module.exports = (app) => {
  postReqValidator(app);
};
