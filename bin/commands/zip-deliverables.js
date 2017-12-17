const json2csv = require('json2csv');
const path = require('path');
const moment = require('moment');
const fs = require('fs');

const makeDir = require('make-dir');

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
          where: {},
          model: db.Events,
          include: [
            {
              model: db.ExerciseSheets,
              include: {
                model: db.ExerciseCategories
              }
            },
            {
              model: db.EventTemplates,
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
            }
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

    const basePath = '/tmp/laboradmin/deliverables';

    makeDir.sync(basePath);
    for (const studentReg of studentRegs) {
      const userNeptun = studentReg.User.neptun;
      makeDir.sync(path.join(basePath, userNeptun));
      for (const event of studentReg.Events) {
        for (const deliverable of event.Deliverables) {
          if (deliverable.filePath) {
            const supplementary = (event.attempt === 2) ? '_POT' : '';
            const exCategoryType = event.EventTemplate.ExerciseCategory.type;
            const fileName = `${userNeptun}_${exCategoryType}_${deliverable.originalFileName}`;
            fs.copyFileSync(deliverable.filePath, path.join(basePath, userNeptun, fileName, supplementary));
          }
        }
      }
    }

    console.log(studentRegs.length);
  } catch (err) {
    console.log(err);
  } finally {
    closeDB();
  }
};
