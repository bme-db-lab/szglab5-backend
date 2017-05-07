const { isDate } = require('lodash');
const async = require('async');
const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

function getQuery(filter) {
  const query = {};

  if ('type' in filter)
    query.type = filter.type;

  return query;
}

module.exports = (req, res) => {
  try {
    const filter = req.query.filter;
    console.log('filter', filter);

    const db = getDB();
    let queryObj = {};
    if (filter) {
      queryObj = {
        where: getQuery(filter)
      };
    }

    db.ExerciseCategories.findAll(queryObj)
      .then(genJSONApiResByRecords.bind(null, db, 'ExerciseCategories'))
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
 * @api {get} /events List ExerciseCategories
 * @apiName List
 * @apiGroup ExerciseCategories
 * @apiDescription List exercise categories
 *
 * @apiParam {String} [filter] filter the exercise categories
 *
 * @apiExample {js} Example filter for type:
 * /events?filter[type]=SQL
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "type": "ExerciseCategories",
 *       "attributes": {
 *         "type": "Oracle",
 *         "createdAt": "2017-05-06T20:47:29.761Z",
 *         "updatedAt": "2017-05-06T20:47:29.761Z"
 *       },
 *       "relationships": {
 *         "ExerciseSheets": {
 *           "data": [
 *             {
 *               "id": 1,
 *               "type": "ExerciseSheets"
 *             },
 *             {
 *               "id": 2,
 *               "type": "ExerciseSheets"
 *             }
 *           ]
 *         }
 *       }
 *     },
 *     {
 *       "id": 2,
 *       "type": "ExerciseCategories",
 *       "attributes": {
 *         "type": "JDBC",
 *         "createdAt": "2017-05-06T20:47:29.765Z",
 *         "updatedAt": "2017-05-06T20:47:29.765Z"
 *       },
 *       "relationships": {
 *         "ExerciseSheets": {
 *           "data": []
 *         }
 *       }
 *     },
 *     {
 *       "id": 3,
 *       "type": "ExerciseCategories",
 *       "attributes": {
 *         "type": "SQL",
 *         "createdAt": "2017-05-06T20:47:29.768Z",
 *         "updatedAt": "2017-05-06T20:47:29.768Z"
 *       },
 *       "relationships": {
 *         "ExerciseSheets": {
 *           "data": []
 *         }
 *       }
 *     }
 *   ]
 * }
 */
