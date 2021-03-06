const { signToken } = require('../../utils/jwt');
const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('../../utils/utils.js');
const { checkIfExist } = require('../../utils/jsonapi');

module.exports = async (req, res) => {
  try {
    const { roles } = req.userInfo;

    if (!roles.includes('ADMIN')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    const userId = req.body.userId;
    const db = getDB();
    const user = await db.Users.findById(userId);
    checkIfExist(user);
    const rolesToSign = await user.getRoles();
    const roleNames = rolesToSign.map(role => role.dataValues.name);
    const token = await signToken(user.dataValues, roleNames);

    res.send({ token });
  } catch (err) {
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};
