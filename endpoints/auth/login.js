const Joi = require('joi');
const bcrypt = require('bcrypt');
const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('../../utils/utils.js');
const { signToken } = require('../../utils/jwt');

const loginReqSchema = Joi.object().keys({
  loginName: Joi.string().required(),
  password: Joi.string().required()
});

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
