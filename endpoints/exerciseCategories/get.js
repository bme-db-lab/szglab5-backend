const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    if (isNaN(reqId)) {
      res.status(400).send(genErrorObj('Requested id is not a number'));
      return;
    }

    const db = getDB();
    db.ExerciseCategories.findById(reqIdNum)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'ExerciseCategories'))
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        if (err.notFound) {
          res.status(404).send(genErrorObj(err.message));
          return;
        }
        res.status(500).send(genErrorObj(err.message));
      });
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

/**
 * @api {get} /deliverables/:id Get exercise category
 * @apiName Get
 * @apiGroup ExerciseCategories
 * @apiDescription Get exercise category information by id
 *
 * @apiParam {Number} [id] Exercise category's id
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": {
 *     "id": 1,
 *     "type": "ExerciseCategories",
 *     "attributes": {
 *       "type": "Oracle",
 *       "createdAt": "2017-05-06T20:47:29.761Z",
 *       "updatedAt": "2017-05-06T20:47:29.761Z"
 *     },
 *     "relationships": {
 *       "ExerciseSheets": {
 *         "data": [
 *           {
 *             "id": 1,
 *             "type": "ExerciseSheets"
 *           },
 *           {
 *             "id": 2,
 *             "type": "ExerciseSheets"
 *           }
 *         ]
 *       }
 *     }
 *   }
 * }
 */
