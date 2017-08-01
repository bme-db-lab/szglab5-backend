const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    const db = getDB();
    db.Roles.findAll()
      .then(genJSONApiResByRecords.bind(null, db, 'Roles'))
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.status(500).send(genErrorObj(err.message));
      });
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

