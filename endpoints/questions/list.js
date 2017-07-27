const { isDate } = require('lodash');
const async = require('async');
const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    const filter = req.query.filter;

    const db = getDB();
    let queryObj = {};
    if (filter) {
      queryObj = {
        where: getQuery(filter),
        include: getIncludes(filter, db)
      };
    }


    db.Questions.findAll(queryObj)
      .then(genJSONApiResByRecords.bind(null, db, 'Questions'))
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
 * @api {get} /test-questions List TestQuestions
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
