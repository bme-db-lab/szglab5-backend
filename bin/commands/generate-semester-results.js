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
                attributes: ['id', 'description', 'type', 'name'],
                where: {
                  $or: [
                    {
                      type: 'FILE'
                    },
                    {
                      type: 'BEUGRO'
                    }
                  ]
                }
              }
            },
            {
              model: db.EventTemplates,
              where: {
                type: 'Labor',
              },
            },
          ]
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

        const eventFound = studentReg.Events.find(event => exCategory.id === event.ExerciseSheet.ExerciseCategory.id && event.attempt === null);
        if (eventFound) {
          grade = eventFound.grade;

          statObj[exCategory.type] = grade;
          statObj[`${exCategory.type}_imsc_labor`] = eventFound.imsc;
          let deliverablesIMSC = null;
          for (const deliverable of eventFound.Deliverables) {
            if (deliverable.imsc) {
              deliverablesIMSC += deliverable.imsc;
            }
          }
          statObj[`${exCategory.type}_imsc_beadando`] = deliverablesIMSC;

          const fileDeliverables = eventFound.Deliverables.filter(deliverable => deliverable.DeliverableTemplate.type === 'FILE');
          for (const deliverable of fileDeliverables) {
            statObj[`${exCategory.type}_${deliverable.DeliverableTemplate.description.replace(' ', '')}_beadando`] = deliverable.grade;
          }

          const entryTestDeliverable = eventFound.Deliverables.find(deliverable => deliverable.DeliverableTemplate.type === 'BEUGRO');
          if (entryTestDeliverable) {
            statObj[`${exCategory.type}_beugro`] = entryTestDeliverable.grade;
          }
        }
      });

      const supplEvent = studentReg.Events.find(event => event.attempt === 2);

      if (supplEvent) {
        if (supplEvent.grade) {
          statObj.Pot = supplEvent.grade;
          statObj.Pot_imsc_labor = supplEvent.imsc;
          let deliverablesIMSC = null;
          for (const deliverable of supplEvent.Deliverables) {
            if (deliverable.imsc) {
              deliverablesIMSC += deliverable.imsc;
            }
          }
          statObj.Pot_imsc_beadando = deliverablesIMSC;
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


    const fields = Object.keys(studentRegData[0]);
    console.log(Object.keys(studentRegData[0]));

    // const fields = flatten(['Nev', 'Neptun', 'Csoport_kod', 'Feladat_kod', 'email', ...exCategories.map(exCat => [exCat.type, `${exCat.type}_imsc_labor`, `${exCat.type}_imsc_beadando`, `${exCat.type}_beugro`]), 'Pot', 'Pot_imsc_labor', 'Pot_imsc_beadando']);
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
