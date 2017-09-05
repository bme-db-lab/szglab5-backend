const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  let loginName = 'Unknown';
  if (req.userInfo && req.userInfo.loginName) {
    loginName = req.userInfo.loginName;
  }

  let reqData = {};
  if (req.method === 'GET' || req.method === 'DELETE') {
    reqData = req.query;
  }

  logger.info(`"${loginName}" ${req.method} request ${req.baseUrl} FROM ${req.ip} DATA ${JSON.stringify(reqData)}`);
  next();
};
