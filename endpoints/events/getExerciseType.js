const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    throw new Error('Not implemented exception!');
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    if (isNaN(reqId)) {
      res.status(400).send(genErrorObj('Requested id is not a number'));
      return;
    }

    const db = getDB();
    db.Events.findById(reqIdNum)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'Events'))
      .then((response) => {
        const exerciseSheet = response.data.relationships.ExerciseSheet;
        if (exerciseSheet === null) {
          res.status(404).send();
          return;
        }
        db.ExerciseSheets.findById(exerciseSheet.data.id)
          .then(genJSONApiResByRecord.bind(null, db, 'ExerciseSheets'))
          .then((responseSheet) => {
            const exerciseType = responseSheet.data.relationships.ExerciseType;
            if (exerciseType === null) {
              res.status(404).send();
              return;
            }
            db.ExerciseTypes.findById(exerciseType.data.id)
              .then(genJSONApiResByRecord.bind(null, db, 'ExerciseTypes'))
              .then((responseType) => {
                res.send(responseType);
              });
          })
          .catch((err) => {
            if (err.notFound) {
              res.status(404).send(genErrorObj(err.message));
              return;
            }
            res.status(500).send(genErrorObj(err.message));
          });
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
 * @api {get} /events/:id/exercisesheet Get Event's exercise type
 * @apiName Get Exercise Type
 * @apiGroup Events
 * @apiDescription Get event's exercise type
 *
 * @apiParam {Number} [id] Event's id
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
 *       "createdAt": "2017-05-06T17:42:31.631Z",
 *       "updatedAt": "2017-05-06T17:42:31.631Z"
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
