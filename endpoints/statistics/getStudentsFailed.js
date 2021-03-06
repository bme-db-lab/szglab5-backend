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
          model: db.Events,
          where: { attempt: null },
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

    const failedStudentRegs = studentRegs.filter((studentReg) => {
      const failedEvents = studentReg.Events.filter(event => (event.grade <= 1 && event.grade !== null));
      return failedEvents.length >= 2;
    });

    const data = failedStudentRegs.map(sr => ({
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
