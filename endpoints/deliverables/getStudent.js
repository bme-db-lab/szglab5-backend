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
        const event = response.data.relationships.Event;
        if (event === null) {
          res.status(404).send();
          return;
        }
        db.Events.findById(event.data.id)
          .then(genJSONApiResByRecord.bind(null, db, 'Events'))
          .then((responseEvent) => {
            const studentReg = responseEvent.data.relationships.StudentRegistration;
            if (studentReg === null) {
              res.status(404).send();
              return;
            }
            db.StudentRegistrations.findById(studentReg.data.id)
              .then(genJSONApiResByRecord.bind(null, db, 'StudentRegistrations'))
              .then((responseStudent) => {
                const userReg = responseStudent.data.relationships.User;
                if (userReg === null) {
                  res.status(404).send();
                  return;
                }
                db.Users.findById(userReg.data.id)
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
 * @api {get} /deliverables/:id/student Get Deliverable's student
 * @apiName Get Student
 * @apiGroup Deliverables
 * @apiDescription Get deliverable's student
 *
 * @apiParam {Number} [id] Deliverable's id
 *
 * @apiSuccessExample Success-Response:
 * {
 *     "data": {
 *         "id": 1,
 *         "type": "Users",
 *         "attributes": {
 *             "displayName": "student",
 *             "loginName": "student",
 *             "email": "student@db.bme.hu",
 *             "sshPublicKey": null,
 *             "colorTheme": "blue-gray",
 *             "subscribedToMailList": false,
 *             "subscribedToEmailNotify": true,
 *             "role": "STUDENT",
 *             "neptun": "STDNT0",
 *             "university": "BME",
 *             "email_official": null,
 *             "mobile": null,
 *             "title": null,
 *             "printSupport": null,
 *             "classroom": null,
 *             "spec": null,
 *             "exercises": null,
 *             "createdAt": "2017-07-12T15:29:43.501Z",
 *             "updatedAt": "2017-07-12T15:29:43.501Z",
 *             "OwnedExerciseId": null
 *         },
 *         "relationships": {
 *             "StudentRegistrations": {
 *                 "data": [
 *                     {
 *                         "id": 1,
 *                         "type": "StudentRegistrations"
 *                     }
 *                 ]
 *             },
 *             "Deliverables": {
 *                 "data": [
 *                     {
 *                         "id": 2,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 3,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 4,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 5,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 6,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 7,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 8,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 9,
 *                         "type": "Deliverables"
 *                     }
 *                 ]
 *             },
 *             "Events": {
 *                 "data": []
 *             },
 *             "StudentGroups": {
 *                 "data": []
 *             },
 *             "ExerciseType": {
 *                 "data": null
 *             }
 *         }
 *     }
 * }
 */
