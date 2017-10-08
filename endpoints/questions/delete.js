const { genErrorObj } = require('../../utils/utils.js');
const { checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);

    const { roles } = req.userInfo;
    // only ADMIN DEMONSTRATOR CORRECTOR
    if (!roles.includes('ADMIN') && !roles.includes('DEMONSTRATOR') && !roles.includes('CORRECTOR')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    const db = getDB();
    await db.Questions.destroy({ where: { id: reqIdNum } });
    res.status(204).send();
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};
