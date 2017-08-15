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
    const eventTemplate = await db.EventTemplates.findById(reqIdNum);
    checkIfExist(eventTemplate);
    const response = await genJSONApiResByRecord(db, 'EventTemplates', eventTemplate);
    response.included = [];
    // Included: Deliverable-Templates
    if (response.data.relationships.DeliverableTemplates.data.length !== 0) {
      for (const delItem of response.data.relationships.DeliverableTemplates.data) {
        const delTemplate = await db.DeliverableTemplates.findById(delItem.id);
        response.included.push({
          id: delTemplate.dataValues.id,
          type: 'DeliverableTemplates',
          attributes: delTemplate.dataValues
        });
      }
    }
    // Incldued: ExerciseCategory
    if (response.data.relationships.ExerciseCategory.data !== null) {
      const exCat = await db.ExerciseCategories.findById(response.data.relationships.ExerciseCategory.data.id);
      response.included.push({
        id: response.data.relationships.ExerciseCategory.data.id,
        type: 'ExerciseCategories',
        attributes: exCat.dataValues
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
 * @api {get} /event-templates/:id Get Event Template
 * @apiName Get
 * @apiGroup EventTemplates
 * @apiDescription Get event template information by id
 *
 * @apiParam {Number} [id] Event Template's id
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": {
 *     "id": 1,
 *     "type": "EventTemplates",
 *     "attributes": {
 *       "title": "SQL",
 *       "number": 5,
 *       "createdAt": "2017-05-06T12:00:00.000Z",
 *       "updatedAt": "2017-05-08T19:12:56.725Z"
 *     },
 *     "relationships": {
 *       "Events": {
 *         "data": []
 *       }
 *     }
 *   }
 * }
 */
