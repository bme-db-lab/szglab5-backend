const Joi = require('joi');
const bcrypt = require('bcrypt');
const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('../../utils/utils.js');
const { signToken } = require('../../utils/jwt');

const loginReqSchema = Joi.object().keys({
  loginName: Joi.string().required(),
  password: Joi.string().required()
});

/**
* @api {post} /auth/login User Login
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam {String} [loginName] User's login name
 * @apiParam {String} [password] User's password
 *
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6IkrDs3Nza2EgUGlzdGEiLCJuZXB0dW4iOm51bGwsImlhdCI6MTQ5MDgyMTg0OCwiZXhwIjoxNDkwODI1NDQ4fQ.CBtcX6CRSid2GuyFjeqVAP6R6kCVefWtfuRnj_Z0ISY"
 * }
 *
 *
 * @apiErrorExample User not exist:
 * HTTP/1.1 403 Forbidden
 * {
 *   "errors": [
 *     {
 *       "title": "User with login name \"joskaspista\" does not exist!"
 *     }
 *   ]
 * }
 * @apiErrorExample Incorrect password:
 * HTTP/1.1 403 Forbidden
 * {
 *   "errors": [
 *     {
 *       "title": "Incorrect password for \"joskapista\""
 *     }
 *   ]
 * }
 */
module.exports = (req, res) => {
  const data = req.body;
  const { error } = Joi.validate(data, loginReqSchema);
  if (error) {
    res.status(400).send({ errors: [error] });
    return;
  }
  const { loginName, password } = data;
  // get user from db with loginName
  const db = getDB();
  db.Users.findOne({ where: { loginName } })
    .then((user) => {
      if (user === null) {
        res.status(403).send(genErrorObj([`User with login name "${loginName}" does not exist!`]));
        return;
      }
      const dbPassHash = user.dataValues.password;
      bcrypt.compare(password, dbPassHash)
        .then((bcryptResult) => {
          if (!bcryptResult) {
            res.status(403).send(genErrorObj([`Incorrect password for "${loginName}"`]));
            return;
          }
          signToken(user.dataValues)
            .then((token) => {
              // sign jwt token user
              res.send({ token });
            })
            .catch((err) => {
              res.status(500).send(genErrorObj([err.message]));
            });
        })
        .catch((err) => {
          res.status(500).send(genErrorObj([err.message]));
        });
    })
    .catch((err) => {
      res.status(500).send(genErrorObj([err.message]));
    });
};
