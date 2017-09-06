const { verifyToken } = require('../utils/jwt.js');
const { genErrorObj } = require('../utils/utils.js');

function auth(req, res, next) {
  // process.env.NODE_ENV !== 'dev' || req.get('Authorization') !== undefined
  if (true) {
    try {
      const authHeader = req.get('Authorization');
      if (!authHeader) {
        req.authStatus = 'UNAUTH';
        next();
        return;
      }
      const bearerPattern = /^Bearer /;
      if (!authHeader.match(bearerPattern)) {
        req.authStatus = 'UNAUTH';
        next();
        return;
      }
      const token = authHeader.split(' ')[1];
      verifyToken(token)
        .then((userInfo) => {
          req.userInfo = userInfo;
          next();
        })
        .catch((err) => {
          req.authStatus = 'UNAUTH';
          next();
        });
    } catch (err) {
      res.status(500).send(genErrorObj([err.message]));
    }
  } else {
    next();
  }
}

module.exports = auth;
