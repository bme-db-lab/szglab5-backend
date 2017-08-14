const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('../../utils/utils.js');

// http://expressjs.com/en/api.html#req.query
// GET localhost:7000/statistics/group?groupID=2
module.exports = async (req, res) => {
  try {
    const reqId = req.query.groupId;
    const reqIdNum = parseInt(reqId, 10);
    const db = getDB();
    const students = [];
    const studentRegQuery = await db.StudentRegistrations.findAll({ where: { StudentGroupId: reqIdNum } });
    for (const student of studentRegQuery) {
      const studentQuery = await db.Users.findById(student.dataValues.UserId);
      const resStudent = {
        id: student.dataValues.UserId,
        neptun: studentQuery.dataValues.neptun,
        events: []
      };
      const eventQuery = await db.Events.findAll({ where: { StudentRegistrationId: student.dataValues.id } });
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
      students.push(resStudent);
    }
    res.send({ students });
  } catch (error) {
    res.status(500).send(genErrorObj(error.message));
  }
};
