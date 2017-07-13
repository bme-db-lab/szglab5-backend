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
        const template = response.data.relationships.DeliverableTemplate;
        if (template == null) {
          res.status(404).send();
          return;
        }
        db.DeliverableTemplates.findById(template.data.id)
          .then(genJSONApiResByRecord.bind(null, db, 'DeliverableTemplates'))
          .then((responseTemplate) => {
            res.send(responseTemplate);
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
 * @api {get} /deliverables/:id/template Get deliverable's template
 * @apiName Get Template
 * @apiGroup Deliverables
 * @apiDescription Get deliverable's template
 *
 * @apiParam {Number} [id] Deliverable's id
 *
 * @apiSuccessExample Success-Response:
 * {
 *     "data": {
 *         "id": 1,
 *         "type": "DeliverableTemplates",
 *         "attributes": {
 *             "description": "Beugró",
 *             "type": "BEUGRO",
 *             "createdAt": "2017-07-13T00:02:46.841Z",
 *             "updatedAt": "2017-07-13T00:02:46.841Z"
 *         },
 *         "relationships": {
 *             "Deliverables": {
 *                 "data": [
 *                     {
 *                         "id": 1,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 4,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 7,
 *                         "type": "Deliverables"
 *                     }
 *                 ]
 *             }
 *         }
 *     }
 * }
 */
