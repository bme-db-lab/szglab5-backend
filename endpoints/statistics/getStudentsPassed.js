const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('../../utils/utils.js');
const { orderBy } = require('lodash');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const { roles } = req.userInfo;

    // only ADMIN DEMONSTRATOR CORRECTOR
    if (!roles.includes('ADMIN') && !roles.includes('DEMONSTRATOR') && !roles.includes('CORRECTOR')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    const studentRegs = await db.StudentRegistrations.findAll({
      include: [
        {
          where: { attempt: null },
          model: db.Events,
          include: {
            where: {},
            model: db.Deliverables,
            include: {
              model: db.DeliverableTemplates,
              where: { type: 'FILE' }
            }
          }
        },
        {
          where: {},
          model: db.Users,
          include: {
            model: db.Roles,
            where: {
              name: 'STUDENT'
            }
          }
        },
      ]
    });

    const okStudentRegs = studentRegs.filter((studentReg) => {
      const okEvents = studentReg.Events.filter((event) => {
        const eventGreade = event.grade >= 2;

        const deliverableGrade = event.Deliverables.every(deliverable => deliverable.uploaded && deliverable.grade >= 2);

        return eventGreade || deliverableGrade;
      });
      return okEvents.length === 5;
    });

    const data = okStudentRegs.map(sr => ({
      neptun: sr.User.neptun,
      displayName: sr.User.displayName
    }));

    const sortedData = orderBy(data, ['displayName']);

    res.send({
      headers: ['neptun', 'displayName'],
      data: sortedData
    });
  } catch (error) {
    res.status(500).send(genErrorObj(error.message));
  }
};
