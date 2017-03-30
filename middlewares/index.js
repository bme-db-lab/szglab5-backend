const postReqValidator = require('./postReqValidator');
const auth = require('./auth');

module.exports = (app) => {
  auth(app);
  postReqValidator(app);
};
