const bcrypt = require('bcrypt');
const config = require('./../../config/config');
const { genErrorObj } = require('../../utils/utils.js');
const { checkIfExist, getJSONApiResponseFromRecord } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const { data } = req.body;

    const { roles } = req.userInfo;
    if (!roles.includes('ADMIN')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    const db = getDB();
    if (data.attributes.newpwd) {
      const newPasswordHash = await bcrypt.hash(data.attributes.newpwd, config.bcrypt.saltRounds);
      data.attributes.password = newPasswordHash;
      delete data.attributes.newpwd;
    }
    const newUser = await db.Users.create(data.attributes);
    checkIfExist(newUser);
    const response = await getJSONApiResponseFromRecord(db, 'Users', newUser);
    res.status(201).send(response);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};
