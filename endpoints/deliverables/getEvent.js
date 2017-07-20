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
        if (event == null) {
          res.status(404).send();
          return;
        }
        db.Events.findById(event.data.id)
          .then(genJSONApiResByRecord.bind(null, db, 'Events'))
          .then((responseEvent) => {
            res.send(responseEvent);
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
 * @api {get} /deliverables/:id/corrector Get deliverable's event
 * @apiName Get Event
 * @apiGroup Deliverables
 * @apiDescription Get deliverable's event
 *
 * @apiParam {Number} [id] Deliverable's id
 *
 * @apiSuccessExample Success-Response:
 * {
 *     "data": {
 *         "id": 1,
 *         "type": "Events",
 *         "attributes": {
 *             "date": "2017-09-12T00:00:00.000Z",
 *             "location": "IL105",
 *             "attempt": 1,
 *             "comment": "No comment.",
 *             "createdAt": "2017-07-13T00:02:47.544Z",
 *             "updatedAt": "2017-07-13T00:02:47.544Z",
 *             "StudentRegistrationId": 1,
 *             "DemonstratorEmail": "demonstrator@db.bme.hu",
 *             "EventTemplateId": 1,
 *             "ExerciseSheetId": 1
 *         },
 *         "relationships": {
 *             "StudentRegistration": {
 *                 "data": {
 *                     "id": 1,
 *                     "type": "StudentRegistrations"
 *                 }
 *             },
 *             "Demonstrator": {
 *                 "data": {
 *                     "id": 3,
 *                     "type": "Users"
 *                 },
 *                 "links": {
 *                     "related": "/events/1/demonstrator"
 *                 }
 *             },
 *             "Deliverables": {
 *                 "data": [
 *                     {
 *                         "id": 1,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 2,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 3,
 *                         "type": "Deliverables"
 *                     }
 *                 ]
 *             },
 *             "EventTemplate": {
 *                 "data": {
 *                     "id": 1,
 *                     "type": "EventTemplates"
 *                 }
 *             },
 *             "ExerciseSheet": {
 *                 "data": {
 *                     "id": 1,
 *                     "type": "ExerciseSheets"
 *                 }
 *             }
 *         }
 *     }
 * }
 */
