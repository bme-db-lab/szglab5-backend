const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();
    const eventTemplates = await db.EventTemplates.findAll();
    const response = await genJSONApiResByRecords(db, 'EventTemplates', eventTemplates);
    response.included = [];
    for (const eventTemplate of response.data) {
      // Included: Deliverable-Templates
      if (eventTemplate.relationships.DeliverableTemplates.data.length !== 0) {
        for (const delItem of eventTemplate.relationships.DeliverableTemplates.data) {
          const delTemplate = await db.DeliverableTemplates.findById(delItem.id);
          response.included.push({
            id: delTemplate.dataValues.id,
            type: 'DeliverableTemplates',
            attributes: delTemplate.dataValues
          });
        }
      }
      // Incldued: ExerciseCategory
      if (eventTemplate.relationships.ExerciseCategory.data !== null) {
        const exCat = await db.ExerciseCategories.findById(eventTemplate.relationships.ExerciseCategory.data.id);
        response.included.push({
          id: eventTemplate.relationships.ExerciseCategory.data.id,
          type: 'ExerciseCategories',
          attributes: exCat.dataValues
        });
      }
    }
    res.send(response);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

/**
 * @api {get} /event-templates List Event Templates
 * @apiName List
 * @apiGroup EventTemplates
 * @apiDescription List event templates
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "type": "EventTemplates",
 *       "attributes": {
 *         "title": "SQL",
 *         "number": 5,
 *         "createdAt": "2017-05-06T12:00:00.000Z",
 *         "updatedAt": "2017-05-08T19:12:56.725Z"
 *       },
 *       "relationships": {
 *         "Events": {
 *           "data": []
 *         }
 *       }
 *     }
 *   ]
 * }
 */
