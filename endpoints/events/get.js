const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    if (isNaN(reqId)) {
      res.status(400).send(genErrorObj('Requested id is not a number'));
      return;
    }

    const db = getDB();
    const event = await db.Events.findById(reqIdNum);
    checkIfExist(event);
    const response = await genJSONApiResByRecord(db, 'Events', event);
    response.included = [];
    // Included: Demonstrator
    if (response.data.relationships.Demonstrator.data !== null) {
      const demonstrator = await db.Users.findById(response.data.relationships.Demonstrator.data.id);
      response.included.push({
        id: response.data.relationships.Demonstrator.data.id,
        type: 'Users',
        attributes: demonstrator.dataValues
      });
    }
    // Included: ExerciseSheet
    if (response.data.relationships.ExerciseSheet.data !== null) {
      const exerciseSheet = await db.ExerciseSheets.findById(response.data.relationships.ExerciseSheet.data.id);
      const exerciseCategory = await exerciseSheet.getExerciseCategory();
      const exerciseType = await exerciseSheet.getExerciseType();

      let exerciseCategoryRel = null;
      if (exerciseCategory !== null) {
        exerciseCategoryRel = {
          data: {
            id: exerciseCategory.id,
            type: 'ExerciseCategories'
          }
        };
        response.included.push({
          id: exerciseCategory.id,
          type: 'ExerciseCategories',
          attributes: exerciseCategory.dataValues,
        });
      }

      let exerciseTypeRel = null;
      if (exerciseCategory !== null) {
        exerciseTypeRel = {
          data: {
            id: exerciseType.id,
            type: 'ExerciseTypes'
          }
        };
        response.included.push({
          id: exerciseType.id,
          type: 'ExerciseTypes',
          attributes: exerciseType.dataValues,
        });
      }

      response.included.push({
        id: response.data.relationships.ExerciseSheet.data.id,
        type: 'ExerciseSheets',
        attributes: exerciseSheet.dataValues,
        relationships: {
          ExerciseCategory: exerciseCategoryRel,
          ExerciseType: exerciseTypeRel
        }
      });
    }
    // Included: Deliverables
    if (response.data.relationships.Deliverables.data.length !== 0) {
      for (const delItem of response.data.relationships.Deliverables.data) {
        const deliverables = await db.Deliverables.findById(delItem.id);
        response.included.push({
          id: deliverables.dataValues.id,
          type: 'Deliverables',
          attributes: deliverables.dataValues
        });
      }
    }
    // Included: EventTemplate
    if (response.data.relationships.EventTemplate.data !== null) {
      const eventTemplate = await db.EventTemplates.findById(response.data.relationships.EventTemplate.data.id);
      response.included.push({
        id: response.data.relationships.EventTemplate.data.id,
        type: 'EventTemplates',
        attributes: eventTemplate.dataValues
      });
    }
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
