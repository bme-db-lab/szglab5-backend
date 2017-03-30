const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecord } = require('../../utils/jsonapi.js');
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
    db.StudentRegistrations.findById(reqIdNum)
      .then(genJSONApiResByRecord.bind(null, db, 'StudentRegistrations'))
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.status(500).send(genErrorObj(err.message));
      });
    // all check has been passed, get that user
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

/**
* @api {get} /studentregistrations/:id Get StudentRegistration
 * @apiName Get
 * @apiGroup StudentRegistrations
 * @apiDescription Get student registrations information with id
 *
 * @apiParam {Number} [id] StudentRegistration's id
 *
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "data": {
 *     "id": 1,
 *     "neptunSubjectCode": "NEPTUN_SUBJ_CODE_1",
 *     "neptunCourseCode": "NEPTUN_COURSE_CODE_1",
 *     "createdAt": "2017-03-30T12:20:00.464Z",
 *     "updatedAt": "2017-03-30T12:20:00.464Z",
 *     "SemesterId": null,
 *     "StudentGroupId": null,
 *     "UserId": 1
 *   },
 *   "relationships": {
 *     "Semester": null,
 *     "StudentGroup": null,
 *     "Events": {
 *       "data": [
 *         {
 *           "id": 1,
 *           "type": "Events"
 *         },
 *         {
 *           "id": 2,
 *           "type": "Events"
 *         },
 *         {
 *           "id": 3,
 *           "type": "Events"
 *         }
 *       ]
 *     },
 *     "User": {
 *       "data": {
 *         "id": 1,
 *         "type": "Users"
 *       }
 *     }
 *   }
 * }
 *
 *
 */
