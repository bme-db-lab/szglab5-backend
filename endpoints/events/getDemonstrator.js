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
    db.Events.findById(reqIdNum)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'Events'))
      .then((response) => {
        const demonstratorUser = response.data.relationships.Demonstrator;
        if (demonstratorUser === null) {
          res.status(404).send();
          return;
        }
        db.Users.findById(demonstratorUser.data.id)
          .then(genJSONApiResByRecord.bind(null, db, 'Users'))
          .then((responseUser) => {
            res.send(responseUser);
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
 * @api {get} /events/:id/demonstrator Get Event's demonstrator
 * @apiName Get Demonstrator
 * @apiGroup Events
 * @apiDescription Get event's demonstrator
 *
 * @apiParam {Number} [id] Event's id
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
