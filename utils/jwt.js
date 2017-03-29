const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

function signToken(user) {
  return new Promise((resolve, reject) => {
    try {
      const { displayName, neptun } = user;
      jwt.sign({
        displayName,
        neptun
      }, config.jwt.secret, { expiresIn: 60 * 60 }, (err, token) => {
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

module.exports = {
  signToken
};
