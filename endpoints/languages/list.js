const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    const db = getDB();
    db.Languages.findAll()
      .then(genJSONApiResByRecords.bind(null, db, 'Languages'))
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

