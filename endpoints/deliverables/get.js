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
    const deliverable = await db.Deliverables.findById(reqIdNum);
    checkIfExist();
    const response = await genJSONApiResByRecord(db, 'Deliverables', deliverable);
    response.included = [];
    // Included: Deliverable Template
    if (response.data.relationships.DeliverableTemplate.data !== null) {
      const deliverables = await db.DeliverableTemplates.findById(response.data.relationships.DeliverableTemplate.data.id);
      response.included.push({
        id: deliverables.dataValues.id,
        type: 'DeliverableTemplates',
        attributes: deliverables.dataValues
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
 * @api {get} /deliverables/:id Get Deliverable
 * @apiName Get
 * @apiGroup Deliverables
 * @apiDescription Get deliverable information with id
 *
 * @apiParam {Number} [id] Deliverable's id
 *
 *
 */
