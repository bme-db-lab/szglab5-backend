const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

function signToken(user, roles) {
  return new Promise((resolve, reject) => {
    try {
      const { displayName, neptun, id, role, colorTheme, loginName } = user;
      jwt.sign({
        displayName,
        neptun,
        loginName,
        userId: id,
        roles,
        colorTheme,
      }, config.jwt.secret, { expiresIn: 60 * 60 * 8 }, (err, token) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(token);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    try {
      // verify a token symmetric
      jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(decoded);
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  signToken,
  verifyToken
};
