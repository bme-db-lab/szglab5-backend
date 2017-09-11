const logger = require('../utils/logger');
const config = require('../config/config');

module.exports = (req, res, next) => {
  let loginName = 'Unknown';
  if (req.userInfo && req.userInfo.loginName) {
    loginName = req.userInfo.loginName;
  }

  let reqData = {};
  if (req.method === 'GET' || req.method === 'DELETE') {
    reqData = req.query;
  }

  if ((req.method === 'POST' || req.method === 'PATCH') && config.logger.logPostData) {
    if (req.body.password) {
      const bodyData = Object.assign({}, req.body);
      bodyData.password = '********';
      reqData = JSON.stringify(bodyData);
    } else if (req.body && req.body.data && req.body.data.attributes && req.body.data.attributes.newpwd) {
      const bodyData = Object.assign({}, req.body);
      bodyData.data.attributes.newpwd = '*******';
      reqData = JSON.stringify(bodyData);
    } else {
      reqData = JSON.stringify(req.body);
    }
  }

  logger.info(`"${loginName}" ${req.method} request ${req.baseUrl} FROM ${req.ip} DATA ${JSON.stringify(reqData)}`);
  next();
};
