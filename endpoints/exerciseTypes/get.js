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
    db.ExerciseTypes.findById(reqIdNum)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'ExerciseTypes'))
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
 * @api {get} /deliverables/:id Get ExerciseType
 * @apiName Get
 * @apiGroup ExerciseTypes
 * @apiDescription Get exercise type information with id
 *
 * @apiParam {Number} [id] Exercise type's id
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": {
 *     "id": 1,
 *     "type": "ExerciseTypes",
 *     "attributes": {
 *       "name": "Videótéka",
 *       "shortName": "VIDEO",
 *       "language": "HU",
 *       "createdAt": "2017-05-06T20:47:29.773Z",
 *       "updatedAt": "2017-05-06T20:47:29.773Z"
 *     },
 *     "relationships": {
 *       "ExerciseSheets": {
 *         "data": [
 *           {
 *             "id": 1,
 *             "type": "ExerciseSheets"
 *           }
 *         ]
 *       }
 *     }
 *   }
 * }
 */
