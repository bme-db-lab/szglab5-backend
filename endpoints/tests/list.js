const { isDate } = require('lodash');
const async = require('async');
const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    const db = getDB();
    db.Tests.findAll()
      .then(genJSONApiResByRecords.bind(null, db, 'Tests'))
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
 * @api {get} /events List Tests
 * @apiName List
 * @apiGroup Tests
 * @apiDescription List tests
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "type": "Tests",
 *       "attributes": {
 *         "title": null,
 *         "createdAt": "2017-03-08T17:40:23.824Z",
 *         "updatedAt": "2017-03-08T17:40:23.824Z"
 *       },
 *       "relationships": {
 *         "TestQuestions": {
 *           "data": [
 *             {
 *               "id": 1,
 *               "type": "TestQuestions"
 *             },
 *             {
 *               "id": 2,
 *               "type": "TestQuestions"
 *             }
 *           ]
 *         }
 *       }
 *     },
 *     {
 *       "id": 2,
 *       "type": "Tests",
 *       "attributes": {
 *         "title": null,
 *         "createdAt": "2017-03-08T17:40:23.839Z",
 *         "updatedAt": "2017-03-08T17:40:23.839Z"
 *       },
 *       "relationships": {
 *         "TestQuestions": {
 *           "data": []
 *         }
 *       }
 *     }
 *   ]
 * }
 */
