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
    db.Deliverables.findById(reqIdNum)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'Deliverables'))
      .then((response) => {
        const correctorUser = response.data.relationships.Corrector;
        if (correctorUser == null) {
          res.status(404).send();
          return;
        }
        db.Users.findById(correctorUser.data.id)
          .then(genJSONApiResByRecord.bind(null, db, 'Users'))
          .then((responseUser) => {
            res.send(responseUser);
          }).catch((err) => {
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
 * @api {get} /deliverables/:id/corrector Get deliverable's corrector
 * @apiName Get Corrector
 * @apiGroup Deliverables
 * @apiDescription Get deliverable's corrector
 *
 * @apiParam {Number} [id] Deliverable's id
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": {
 *     "id": 2,
 *     "type": "Users",
 *     "attributes": {
 *       "displayName": "Demonstrátor Dénes",
 *       "loginName": "demonstrator",
 *       "email": null,
 *       "sshPublicKey": null,
 *       "colorTheme": "blue-gray",
 *       "role": "DEMONSTRATOR",
 *       "neptun": null,
 *       "university": null,
 *       "email_official": null,
 *       "mobile": null,
 *       "title": null,
 *       "printSupport": null,
 *       "classroom": null,
 *       "spec": null,
 *       "exercises": null,
 *       "createdAt": "2017-05-17T23:46:06.751Z",
 *       "updatedAt": "2017-05-17T23:46:06.751Z",
 *       "OwnedExerciseId": null
 *     },
 *     "relationships": {
 *       "StudentRegistrations": {
 *         "data": []
 *       },
 *       "Deliverables": {
 *         "data": []
 *       },
 *       "Events": {
 *         "data": []
 *       },
 *       "StudentGroups": {
 *         "data": []
 *       },
 *       "ExerciseType": {
 *         "data": null
 *       }
 *     }
 *   }
 * }
 */
