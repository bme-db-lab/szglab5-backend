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
    db.DeliverableTemplates.findById(reqIdNum)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'DeliverableTemplates'))
      .then((response) => {
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
* @api {get} /deliverable-templates/:id Get DeliverableTemplates
 * @apiName Get
 * @apiGroup DeliverableTemplates
 * @apiDescription Get deliverable template information with id
 *
 * @apiParam {Number} [id] DeliverableTemplates's id
 * 
 * @apiSuccessExample Success-Response:
 * {
 *   "data": {
 *     "id": 1,
 *     "type": "DeliverableTemplates",
 *     "attributes": {
 *       "description": "Beugro",
 *       "createdAt": "2017-05-05T14:59:31.891Z",
 *       "updatedAt": "2017-05-05T14:59:31.891Z"
 *     },
 *     "relationships": {
 *       "Deliverables": {
 *         "data": [
 *           {
 *             "id": 1,
 *             "type": "Deliverables"
 *           },
 *           {
 *             "id": 3,
 *             "type": "Deliverables"
 *           }
 *         ]
 *       }
 *     }
 *   }
 * }
 */
