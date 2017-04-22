const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    const filter = req.params.filter;

    const db = getDB();
    db.Events.findAll({})
      .then(genJSONApiResByRecords.bind(null, db, 'Events'))
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

/**
* @api {get} /events Get Events
 * @apiName Get
 * @apiGroup Events
 * @apiDescription Get events
 *
 * @apiParam {String} [filter] filter the events
 *
 */
