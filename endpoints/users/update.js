const { genErrorObj, setRelations } = require('../../utils/utils.js');
const { checkIfHasRole } = require('../../utils/roles');
const { updateResource, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');
const bcrypt = require('bcrypt');
const config = require('./../../config/config');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const { data } = req.body;
    const db = getDB();

    // check if password changing
    if (data.attributes.newpwd !== null && data.attributes.newpwd !== undefined) {
      const user = await db.Users.findById(reqId);
      checkIfExist(user);
      // IF the user has ADMIN roles check old password checking
      if (!checkIfHasRole(req.userInfo.roles, 'ADMIN')) {
        const passwordHash = user.dataValues.password;
        if (!data.attributes.oldpwd) {
          res.status(400).send(genErrorObj('Old password required to password change!'));
        }
        const bcryptResult = await bcrypt.compare(data.attributes.oldpwd, passwordHash);
        if (!bcryptResult) {
          res.status(403).send(genErrorObj(['Incorrect password']));
          return;
        }
      }
      // password ok, lets change the password
      const newPasswordHash = await bcrypt.hash(data.attributes.newpwd, config.bcrypt.saltRounds);
      await db.Users.update({ password: newPasswordHash }, { where: { id: reqId } });
      res.status(204).send();
    } else {
      const user = await db.Users.findById(reqId);
      checkIfExist(user);
      await updateResource(db, 'Users', data);
      await setRelations(db, user, data.relationships);
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
