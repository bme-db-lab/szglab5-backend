const { genErrorObj } = require('../../utils/utils.js');
const { updateResource, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');
const bcrypt = require('bcrypt');
const config = require('./../../config/config');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const { data } = req.body;
    const db = getDB();
    console.log(req.userInfo);

    // if client
    if (data.attributes.newpwd !== null && data.attributes.newpwd !== undefined) {
      console.log('-----------------');
      console.log('Change password!');
      console.log('-----------------');
      const user = await db.Users.findById(reqId);
      checkIfExist(user);
      const passwordHash = user.dataValues.password;
      const bcryptResult = await bcrypt.compare(data.attributes.oldpwd, passwordHash);
      if (!bcryptResult) {
        res.status(403).send(genErrorObj(['Incorrect password']));
        return;
      }
      // password ok, lets change the password
      const newPasswordHash = await bcrypt.hash(data.attributes.newpwd, config.bcrypt.saltRounds);
      await db.Users.update({ password: newPasswordHash }, { where: { id: reqId } });
      res.status(204).send();
    } else {
      const user = await db.Users.findById(reqId);
      checkIfExist(user);
      await updateResource(db, 'Users', data);
      res.status(204).send();
    }
  } catch (err) {
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};
