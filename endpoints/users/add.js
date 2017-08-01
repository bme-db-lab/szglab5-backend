const bcrypt = require('bcrypt');
const config = require('./../../config/config');
const { genErrorObj } = require('../../utils/utils.js');
const { checkIfExist, genJSONApiResByRecord } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const { data } = req.body;

    const db = getDB();
    if (data.attributes.password) {
      const newPasswordHash = await bcrypt.hash(data.attributes.password, config.bcrypt.saltRounds);
      data.attributes.password = newPasswordHash;
    }
    const newUser = await db.Users.create(data.attributes);
    checkIfExist(newUser);
    const response = await genJSONApiResByRecord(db, 'Users', newUser);
    res.status(201).send(response);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};
