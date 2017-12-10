const json2csv = require('json2csv');
const path = require('path');
const moment = require('moment');
const fs = require('fs');

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
          include: {
            model: db.ExerciseSheets,
            include: {
              model: db.ExerciseCategories
            }
          }
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
      });

      return statObj;
    });

    const fields = ['Nev', 'Neptun', 'Csoport_kod', 'Feladat_kod', 'email', ...exCategories.map(exCat => exCat.type)];
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
