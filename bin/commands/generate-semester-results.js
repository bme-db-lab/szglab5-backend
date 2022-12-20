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
      include: [
        {
          model: db.ExerciseCategories
        },
        {
          model: db.DeliverableTemplates
        }
      ],
      order: ['seqNumber']
    });

    const exCategories = eventTemplates.map(eventTemplate => ({
      type: eventTemplate.ExerciseCategory.type,
      id: eventTemplate.ExerciseCategory.id,
      fileDeliverableDescriptions: eventTemplate.DeliverableTemplates.filter(deliverableTemplate => deliverableTemplate.type === 'FILE').map((deliverableTemplate) => (deliverableTemplate.description)).sort(),
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
        statObj.Pot = supplEvent.grade;
        statObj.Pot_imsc_labor = supplEvent.imsc;
        let deliverablesIMSC = null;
        for (const deliverable of supplEvent.Deliverables) {
          if (deliverable.imsc) {
            deliverablesIMSC += deliverable.imsc;
          }
        }
        statObj.Pot_imsc_beadando = deliverablesIMSC;

        const fileDeliverables = supplEvent.Deliverables.filter(deliverable => deliverable.DeliverableTemplate.type === 'FILE');
        for (const deliverable of fileDeliverables) {
          statObj[`Pot_${deliverable.DeliverableTemplate.description.replace(' ', '')}_beadando`] = deliverable.grade;
        }

        const entryTestDeliverable = supplEvent.Deliverables.find(deliverable => deliverable.DeliverableTemplate.type === 'BEUGRO');
        if (entryTestDeliverable) {
          statObj[`Pot_beugro`] = entryTestDeliverable.grade;
        }
      } else {
        statObj.Pot = '-';
      }
      return statObj;
    }).sort((a, b) => a.Nev.localeCompare(b.Nev));

    // generate a list of all possible file deliverables, as they may occure at the supplementary event
    const supplDeliverableDescriptions = Array.from(new Set(flatten(exCategories.map(exCat => exCat.fileDeliverableDescriptions)))).sort();
    // generate column in the CSV for the required fields.
    // Don't forget to modify this when data fields are generated above
    const fields = flatten(['Nev', 'Neptun', 'Csoport_kod', 'Feladat_kod', 'email', ...exCategories.map(exCat => [
      exCat.type, `${exCat.type}_imsc_labor`, `${exCat.type}_imsc_beadando`, `${exCat.type}_beugro`,
      ...exCat.fileDeliverableDescriptions.map(fDD => `${exCat.type}_${fDD.replace(' ', '')}_beadando`)]),
      'Pot', 'Pot_imsc_labor', 'Pot_imsc_beadando', 'Pot_beugro',
      ...supplDeliverableDescriptions.map(sDD => `Pot_${sDD.replace(' ', '')}_beadando`),
    ]);

    const result = json2csv({ data: studentRegData, fields });
    // generate column in the CSV for all the toplevel fields of the objects
    //const result = json2csv({ data: studentRegData });

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
