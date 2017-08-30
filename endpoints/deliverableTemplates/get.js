const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);

    const db = getDB();
    const deliverableTemplate = await db.DeliverableTemplates.findById(
      reqIdNum,
      { include: [{ all: true }] }
    );
    checkIfExist(deliverableTemplate);
    const response = getJSONApiResponseFromRecord(db, 'DeliverableTemplates', deliverableTemplate, {
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

