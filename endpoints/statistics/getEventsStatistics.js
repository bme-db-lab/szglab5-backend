const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('../../utils/utils.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();
    const { eventTemplateId } = req.query;

    const { roles } = req.userInfo;

    // only ADMIN DEMONSTRATOR CORRECTOR
    if (!roles.includes('ADMIN') && !roles.includes('DEMONSTRATOR') && !roles.includes('CORRECTOR')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    if (!eventTemplateId) {
      throw new Error('Required query parameteres: "(eventTemplateId)"');
    }

    const studentGroups = await db.StudentGroups.findAll({
      include: [
        {
          model: db.StudentRegistrations,
          attributes: ['id'],
          where: {},
          include: {
            model: db.Events,
            attributes: ['id', 'finalized', 'grade', 'date'],
            where: {
              EventTemplateId: parseInt(eventTemplateId, 10)
            },
            include: {
              model: db.Deliverables,
              include: {
                model: db.DeliverableTemplates,
                attributes: ['id'],
                where: {
                  type: 'FILE'
                }
              },
            }
          }
        },
        {
          model: db.Users,
          attributes: ['id', 'displayName']
        }
      ]
    });

    const deliverableTemplates = await db.DeliverableTemplates.findAll({
      where: {
        $and: [
          {
            type: 'FILE'
          },
          {
            EventTemplateId: parseInt(eventTemplateId, 10)
          }
        ]
      },
      attributes: ['id']
    });

    const data = [];
    studentGroups.forEach((studentGroup) => {
      let hasGrade = 0;
      let finalized = 0;
      let correctedDeliverables = 0;
      studentGroup.StudentRegistrations.forEach((studentReg) => {
        if (studentReg.Events[0].finalized === true) {
          finalized += 1;
        }
        // if ((studentReg.Events[0].grade >= 0 && studentReg.Events[0].grade < 6)) {
        //   hasGrade += 1;
        // }
        if (studentReg.Events[0].grade !== null) {
          hasGrade += 1;
        }
        studentReg.Events[0].Deliverables.forEach((deliverable) => {
          if (deliverable.finalized) {
            correctedDeliverables += 1;
          }
        });
      });
      data.push({
        groupName: studentGroup.name,
        demonstrator: studentGroup.User.displayName,
        students: studentGroup.StudentRegistrations.length,
        hasGrade,
        finalized,
        correctedDeliverables: correctedDeliverables / deliverableTemplates.length,
        date: studentGroup.StudentRegistrations[0].Events[0].date
      });
    });

    const sortedData = data.sort((event1, event2) => {
      if (event1.demonstrator > event2.demonstrator) {
        return 1;
      }
      return -1;
    });

    const table = {
      headers: ['groupName', 'demonstrator', 'students', 'correctedDeliverables', 'hasGrade', 'finalized'],
      data: sortedData
    };
    res.send(table);
  } catch (error) {
    res.status(500).send(genErrorObj(error.message));
  }
};
