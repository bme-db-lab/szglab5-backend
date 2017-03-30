const { genErrorObj } = require('../../utils/utils.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    const reqUserIdStr = req.params.id;
    let reqUserIdNum = null;
    reqUserIdNum = parseInt(reqUserIdStr, 10);
    if (isNaN(reqUserIdNum)) {
      res.status(400).send(genErrorObj('Requested id is not a number'));
      return;
    }

    const { userId } = req.userInfo;
    if (reqUserIdNum !== userId) {
      res.status(403).send(genErrorObj('You can access only your own user'));
      return;
    }

    const db = getDB();
    db.users.findById(reqUserIdNum)
      .then()
      .catch((err) => {
        res.status(500).send(genErrorObj(err.message));
      });
    // all check has been passed, get that user
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};
