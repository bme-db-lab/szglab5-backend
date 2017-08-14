const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('../../utils/utils.js');

// http://expressjs.com/en/api.html#req.query
// localhost:7000/statistics/student?studentId=1
module.exports = async (req, res) => {
  try {
    const reqId = req.query.studentId;
    const reqIdNum = parseInt(reqId, 10);
    const db = getDB();
    const studentQuery = await db.Users.findById(reqIdNum);
    const resStudent = {
      id: studentQuery.dataValues.id,
      neptun: studentQuery.dataValues.neptun,
      events: []
    };
    const studRegQuery = await db.StudentRegistrations.findOne({ where: { UserId: reqIdNum } });
    const eventQuery = await db.Events.findAll({ where: { StudentRegistrationId: studRegQuery.dataValues.id } });
    for (const event of eventQuery) {
      const deliverableQuery = await db.Deliverables.findAll({ where: { EventId: event.dataValues.id } });
      const resEvent = {
        date: event.dataValues.date,
        deliverables: []
      };
      for (const deliverable of deliverableQuery) {
        const resDeliverable = { grade: deliverable.dataValues.grade };
        resEvent.deliverables.push(resDeliverable);
      }
      resStudent.events.push(resEvent);
    }
    res.send({ resStudent });
  } catch (error) {
    res.status(500).send(genErrorObj(error.message));
  }
};
