const { genErrorObj } = require('../../utils/utils.js');
const { updateResource, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');
const bcrypt = require('bcrypt');
const config = require('./../../config/config');

module.exports = (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    if (isNaN(reqId)) {
      res.status(400).send(genErrorObj('Requested id is not a number'));
      return;
    }

    const { data } = req.body;
    const db = getDB();

    console.log('data', data);
    if (data.attributes.newpwd !== null) {
      console.log('-----------------');
      console.log('Change password!');
      console.log('-----------------');
      db.Users.findById(reqId)
      .then(checkIfExist)
      .then((user) => {
        const passwordHash = user.dataValues.password;
        bcrypt.compare(data.attributes.oldpwd, passwordHash)
          .then((bcryptResult) => {
            if (!bcryptResult) {
              res.status(403).send(genErrorObj(['Incorrect password']));
              return;
            }
            // password ok, lets change the password
            const newPasswordHash = bcrypt.hashSync(data.attributes.newpwd, config.bcrypt.saltRounds);
            db.Users.update({ password: newPasswordHash }, { where: { id: reqId } })
              .then(() => {
                res.status(204).send();
              })
              .catch((err) => {
                res.status(500).send(genErrorObj(err.message));
              });
          });
      });
    } else {
      db.Users.findById(reqId)
        .then(checkIfExist)
        .then(updateResource.bind(null, db, 'Users', data))
        .then(() => {
          res.status(204).send();
        })
        .catch((err) => {
          if (err.notFound) {
            res.status(404).send(genErrorObj(err.message));
            return;
          }
          res.status(500).send(genErrorObj(err.message));
        });
    }
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

/**
 * @api {patch} /deliverables/:id. Update Deliverable
 * @apiName Patch
 * @apiGroup Deliverables
 * @apiDescription Update a deliverable
 *
 */
