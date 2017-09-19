const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('./../../utils/utils');

module.exports = (req, res) => {
  try {
    const db = getDB();

    const { roles } = req.userInfo;
    if (!roles.includes('ADMIN')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    db.sequelize.query(req.body.sqlText)
      .then((results, metadata) => {
        res.json(results);
      })
      .catch((err) => {
        res.status(500).send(genErrorObj(err.message));
      });
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};
