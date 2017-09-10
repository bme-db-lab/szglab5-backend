const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);

    const db = getDB();
    const deliverable = await db.Deliverables.findById(
      reqIdNum,
      {
        include: [
          {
            model: db.Events,
            include: [{
              model: db.StudentRegistrations,
              include: [{
                model: db.Users,
              }]
            }]
          }
        ]
      }
    );

    checkIfExist(deliverable);
    const response = getJSONApiResponseFromRecord(db, 'Deliverables', deliverable, {
      includeModels: ['DeliverableTemplates', 'Events']
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

