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
        if (response.data.relationships.Demonstrator !== null) {
          delete response.data.relationships.Demonstrator.data;
        }
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
 * @api {get} /events/:id Get Event
 * @apiName Get
 * @apiGroup Events
 * @apiDescription Get event information with id
 *
 * @apiParam {Number} [id] Event's id
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "data": {
 *     "id": 1,
 *     "type": "Events",
 *     "attributes": {
 *       "date": "2017-03-30T12:11:17.576Z",
 *       "location": "IL105",
 *       "attempt": 0,
 *       "comment": null,
 *       "createdAt": "2017-05-06T17:42:31.663Z",
 *       "updatedAt": "2017-05-06T17:42:31.663Z",
 *       "StudentRegistrationId": 1,
 *       "DemonstratorId": 2,
 *       "EventTemplateId": null,
 *       "ExerciseSheetId": 1
 *     },
 *     "relationships": {
 *       "StudentRegistration": {
 *         "data": {
 *           "id": 1,
 *           "type": "StudentRegistrations"
 *         }
 *       },
 *       "Demonstrator": {
 *         "links": {
 *           "related": "/events/1/demonstrator"
 *         }
 *       },
 *       "Deliverables": {
 *         "data": [
 *           {
 *             "id": 1,
 *             "type": "Deliverables"
 *           },
 *           {
 *             "id": 2,
 *             "type": "Deliverables"
 *           }
 *         ]
 *       },
 *       "EventTemplate": {
 *         "data": null
 *       },
 *       "ExerciseSheet": {
 *         "data": {
 *           "id": 1,
 *           "type": "ExerciseSheets"
 *         }
 *       }
 *     }
 *   }
 * }
 *
 */
