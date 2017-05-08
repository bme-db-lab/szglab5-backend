const { isDate } = require('lodash');
const async = require('async');
const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    const db = getDB();
    db.EventTemplates.findAll()
      .then(genJSONApiResByRecords.bind(null, db, 'EventTemplates'))
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
 * @api {get} /event-templates List Event Templates
 * @apiName List
 * @apiGroup EventTemplates
 * @apiDescription List event templates
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "type": "EventTemplates",
 *       "attributes": {
 *         "title": "SQL",
 *         "number": 5,
 *         "createdAt": "2017-05-06T12:00:00.000Z",
 *         "updatedAt": "2017-05-08T19:12:56.725Z"
 *       },
 *       "relationships": {
 *         "Events": {
 *           "data": []
 *         }
 *       }
 *     }
 *   ]
 * }
 */
