const { verifyToken } = require('../utils/jwt.js');
const { genErrorObj } = require('../utils/utils.js');

function auth(req, res, next) {
  if (process.env.NODE_ENV !== 'dev' || req.get('Authorization') !== undefined) {
    try {
      const authHeader = req.get('Authorization');
      if (!authHeader) {
        res.status(403).send(genErrorObj('No Authorization header present!'));
        return;
      }
      const bearerPattern = /^Bearer /;
      if (!authHeader.match(bearerPattern)) {
        res.status(403).send(genErrorObj('Invalid Authorization header format'));
        return;
      }
      const token = authHeader.split(' ')[1];
      verifyToken(token)
        .then((userInfo) => {
          req.userInfo = userInfo;
          req.authStatus = 'AUTH';
          next();
        })
        .catch((err) => {
          res.status(403).send(genErrorObj([err.message]));
        });
    } catch (err) {
      res.status(500).send(genErrorObj([err.message]));
    }
  } else {
    next();
  }
}

module.exports = auth;
