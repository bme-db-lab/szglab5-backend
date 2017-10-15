const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');
const { orderBy } = require('lodash');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);

    const db = getDB();
    const studentReg = await db.StudentRegistrations.findById(
      reqIdNum,
      {
        include: [
          {
            model: db.Semesters
          },
          {
            model: db.Events,
          },
          {
            model: db.Users
          },
          {
            model: db.StudentGroups
          },
          {
            model: db.ExerciseTypes
          }
        ]
      }
    );
    checkIfExist(studentReg);
    const sortedEvents = orderBy(studentReg.Events, ['date']);
    studentReg.Events = sortedEvents;

    const response = getJSONApiResponseFromRecord(db, 'StudentRegistrations', studentReg, {
      includeModels: []
    });
    res.send(response);
  } catch (err) {
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};

/**
* @api {get} /student-registrations/:id Get StudentRegistration
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
