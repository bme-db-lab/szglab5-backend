const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    const db = getDB();

    const { roles, userId } = req.userInfo;

    if (roles.includes('STUDENT')) {
      const deliverables = await db.Deliverables.findAll({
        include: [
          {
            attributes: ['id'],
            model: db.Events,
            where: {},
            include: {
              attributes: ['id'],
              model: db.StudentRegistrations,
              where: { UserId: userId }
            }
          }
        ],
        attributes: ['id']
      });
      const deliverableIds = deliverables.map(del => del.id);
      if (!deliverableIds.includes(reqIdNum)) {
        res.status(403).send(genErrorObj('Unathorized'));
        return;
      }
    }

    const deliverable = await db.Deliverables.findById(reqIdNum, {
      include: [{ model: db.Events }]
    });
    checkIfExist(deliverable);
    const deliverableResponse = getJSONApiResponseFromRecord(db, 'Deliverables', deliverable);
    const eventRel = deliverableResponse.data.relationships.Event;
    if (eventRel == null) {
      res.status(404).send();
      return;
    }
    const event = await db.Events.findById(eventRel.data.id, {
      include: [{ all: true }]
    });
    const eventResponse = getJSONApiResponseFromRecord(db, 'Events', event);
    res.send(eventResponse);
  } catch (err) {
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};
