const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('./../../utils/utils');

module.exports = (req, res) => {
  try {
    const db = getDB();
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
