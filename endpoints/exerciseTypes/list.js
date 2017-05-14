const { isDate } = require('lodash');
const async = require('async');
const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

function getQuery(filter) {
  const query = {};

  if ('language' in filter)
    query.language = filter.language;

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

    db.ExerciseTypes.findAll(queryObj)
      .then(genJSONApiResByRecords.bind(null, db, 'ExerciseTypes'))
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
 * @api {get} /exercise-types List ExerciseTypes
 * @apiName List
 * @apiGroup ExerciseTypes
 * @apiDescription List exercise types
 *
 * @apiParam {String} [filter] filter the exercise types
 *
 * @apiExample {js} Example filter for language:
 * /events?filter[language]=HU
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "type": "ExerciseTypes",
 *       "attributes": {
 *         "name": "Videótéka",
 *         "shortName": "VIDEO",
 *         "language": "HU",
 *         "createdAt": "2017-05-06T20:47:29.773Z",
 *         "updatedAt": "2017-05-06T20:47:29.773Z"
 *       },
 *       "relationships": {
 *         "ExerciseSheets": {
 *           "data": [
 *             {
 *               "id": 1,
 *               "type": "ExerciseSheets"
 *             }
 *           ]
 *         }
 *       }
 *     },
 *     {
 *       "id": 2,
 *       "type": "ExerciseTypes",
 *       "attributes": {
 *         "name": "Hajózás",
 *         "shortName": "HAJO",
 *         "language": "HU",
 *         "createdAt": "2017-05-06T20:47:29.780Z",
 *         "updatedAt": "2017-05-06T20:47:29.780Z"
 *       },
 *       "relationships": {
 *         "ExerciseSheets": {
 *           "data": [
 *             {
 *               "id": 2,
 *               "type": "ExerciseSheets"
 *             }
 *           ]
 *         }
 *       }
 *     },
 *     {
 *       "id": 3,
 *       "type": "ExerciseTypes",
 *       "attributes": {
 *         "name": "Road transportation",
 *         "shortName": "ROAD",
 *         "language": "EN",
 *         "createdAt": "2017-05-06T20:47:29.789Z",
 *         "updatedAt": "2017-05-06T20:47:29.789Z"
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
