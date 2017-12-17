const json2csv = require('json2csv');
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const { flatten } = require('lodash');

const { initDB, closeDB } = require('../../db/db.js');

module.exports = async () => {
  try {
    const db = await initDB();

    const studentRegs = await db.StudentRegistrations.findAll({
      include: [
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
        {
          model: db.Events,
          include: [
            {
              model: db.ExerciseSheets,
              include: {
                model: db.ExerciseCategories
              }
            },
            {
              where: {},
              model: db.Deliverables,
              include: {
                model: db.DeliverableTemplates,
                attributes: ['id', 'description'],
                where: {
                  type: 'FILE'
                }
              }
            }]
        },
        {
          model: db.ExerciseTypes
        },
        {
          where: {},
          model: db.StudentGroups
        }
      ]
    });

    const eventTemplates = await db.EventTemplates.findAll({
      include: {
        model: db.ExerciseCategories
      },
      order: ['seqNumber']
    });

    const exCategories = eventTemplates.map(eventTemplate => ({
      type: eventTemplate.ExerciseCategory.type,
      id: eventTemplate.ExerciseCategory.id
    }));

    const studentRegData = studentRegs.map((studentReg) => {
      const statObj = {
        Nev: studentReg.User.displayName,
        Neptun: studentReg.User.neptun,
        Csoport_kod: studentReg.StudentGroup.name,
        Feladat_kod: studentReg.ExerciseType.shortName,
        email: studentReg.User.email,
      };

      exCategories.forEach((exCategory) => {
        let grade = 'n/a';

        const eventFound = studentReg.Events.find(event => exCategory.id === event.ExerciseSheet.ExerciseCategory.id);
        if (eventFound) {
          grade = eventFound.grade;
        }
        statObj[exCategory.type] = grade;
        statObj[`${exCategory.type}_imsc_labor`] = eventFound.imsc;
        let deliverablesIMSC = null;
        for (const deliverable of eventFound.Deliverables) {
          if (deliverable.imsc) {
            deliverablesIMSC += deliverable.imsc;
          }
        }
        statObj[`${exCategory.type}_imsc_beadando`] = deliverablesIMSC;
      });

      const supplEvent = studentReg.Events.find(event => event.attempt === 2);

      if (supplEvent) {
        if (supplEvent.grade) {
          statObj.Pot = (supplEvent.grade);
        } else {
          let grade = null;
          for (const deliverable of supplEvent.Deliverables) {
            if (!deliverable.grade) {
              grade = null;
              break;
            }
            grade += deliverable.grade / supplEvent.Deliverables.length;
          }
          statObj.Pot = grade;
        }
      } else {
        statObj.Pot = '-';
      }

      return statObj;
    });

    const fields = flatten(['Nev', 'Neptun', 'Csoport_kod', 'Feladat_kod', 'email', ...exCategories.map(exCat => [exCat.type, `${exCat.type}_imsc_labor`, `${exCat.type}_imsc_beadando`]), 'Pot']);
    const result = json2csv({ data: studentRegData, fields });
    const pathToWrite = path.join(__dirname, `semester_results_${moment().format('YYYY_MM_DD_HH-mm')}.csv`);
    fs.writeFileSync(pathToWrite, result);
    console.log(`CSV file created at: ${pathToWrite}`);
    console.log(studentRegs.length);
  } catch (err) {
    console.log(err);
  } finally {
    closeDB();
  }
};
