const { isDate } = require('lodash');
const async = require('async');
const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    const db = getDB();
    db.TestQuestions.findAll()
      .then(genJSONApiResByRecords.bind(null, db, 'TestQuestions'))
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
 * @api {get} /events List TestQuestions
 * @apiName List
 * @apiGroup TestQuestions
 * @apiDescription List test questions
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "type": "TestQuestions",
 *       "attributes": {
 *         "text": "Question 1",
 *         "createdAt": "2017-03-08T17:40:23.839Z",
 *         "updatedAt": "2017-03-08T17:40:23.839Z"
 *       },
 *       "relationships": {}
 *     },
 *     {
 *       "id": 2,
 *       "type": "TestQuestions",
 *       "attributes": {
 *         "text": "Question 2",
 *         "createdAt": "2017-03-08T17:40:23.855Z",
 *         "updatedAt": "2017-03-08T17:40:23.855Z"
 *       },
 *       "relationships": {}
 *     }
 *   ]
 * }
 */
