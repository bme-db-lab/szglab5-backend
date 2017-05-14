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
        const studentRegistration = response.data.relationships.StudentRegistration;
        if (studentRegistration === null) {
          res.status(404).send();
          return;
        }
        db.StudentRegistrations.findById(studentRegistration.data.id)
          .then(genJSONApiResByRecord.bind(null, db, 'StudentRegistrations'))
          .then((responseStudent) => {
            const user = responseStudent.data.relationships.User;
            if (user === null) {
              res.status(404).send();
              return;
            }
            db.Users.findById(user.data.id)
              .then(genJSONApiResByRecord.bind(null, db, 'Users'))
              .then((responseUser) => {
                res.send(responseUser);
              });
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
 * @api {get} /events/:id/student Get Event's student
 * @apiName Get Student
 * @apiGroup Events
 * @apiDescription Get event's student
 *
 * @apiParam {Number} [id] Event's id
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": {
 *     "id": 1,
 *     "type": "Users",
 *     "attributes": {
 *       "displayName": "Student Sarolta",
 *       "loginName": "student",
 *       "email": "student.email@cool-emailprovider.com",
 *       "sshPublicKey": null,
 *       "colorTheme": "blue-gray",
 *       "role": "STUDENT",
 *       "neptun": "Q87XXZ",
 *       "university": null,
 *       "email_official": null,
 *       "mobile": null,
 *       "title": null,
 *       "printSupport": null,
 *       "studentgroup_id": null,
 *       "classroom": null,
 *       "spec": null,
 *       "exercises": null,
 *       "ownedExerciseID": null,
 *       "createdAt": "2017-05-06T20:47:29.416Z",
 *       "updatedAt": "2017-05-06T20:47:29.416Z"
 *     },
 *     "relationships": {
 *       "StudentRegistrations": {
 *         "data": [
 *           {
 *             "id": 1,
 *             "type": "StudentRegistrations"
 *           }
 *         ]
 *       },
 *       "Deliverables": {
 *         "data": []
 *       }
 *     }
 *   }
 * }
 */
