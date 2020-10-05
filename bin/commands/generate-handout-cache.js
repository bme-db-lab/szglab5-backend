const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const { initDB, closeDB } = require('../../db/db.js');
const sheet = require('../../utils/generateSheet.js');

const EVENT_TEMPLATES = {
  ALL: 'ALL',
  SUPPLEMENTARY: 'SUPPLEMENTARY',
};

const CACHE_BASE_PATH = path.join(__dirname, '../../handout-cache');

module.exports = async () => {
  try {
    const db = await initDB();
    const confirmPromptResult = await inquirer.prompt([
      {
        type: 'list',
        choices: [
          {
            name: 'All',
            value: EVENT_TEMPLATES.ALL,
          },
          {
            name: 'Supplementary',
            value: EVENT_TEMPLATES.SUPPLEMENTARY,
          },
        ],
        name: 'events',
        message: 'Choose events',
      },
    ]);

    const eventCondition =
      confirmPromptResult.events === EVENT_TEMPLATES.SUPPLEMENTARY
        ? { attempt: 2 }
        : {};

    const studentRegs = await db.StudentRegistrations.findAll({
      include: [
        {
          where: eventCondition,
          model: db.Events,
          include: [
            {
              model: db.ExerciseSheets,
              include: [
                {
                  model: db.ExerciseCategories
                },
                {
                  model: db.ExerciseTypes
                }
              ]
            },
            {
              model: db.StudentRegistrations,
              include: {
                model: db.Users
              }
            },
            {
              model: db.Users,
              as: 'Demonstrator'
            }
          ]
        },
        {
          where: {},
          model: db.Users,
          include: {
            model: db.Roles,
            where: {
              name: 'STUDENT',
            },
          },
        },
      ],
    });

    let count = 0;

    for (const studentReg of studentRegs) {
      console.log(`${studentReg.User.neptun} - ${++count}/${studentRegs.length}`);

      // Create folder for student
      const studentFolderPath = path.join(CACHE_BASE_PATH, studentReg.User.neptun);
      if (!fs.existsSync(studentFolderPath)) {
        fs.mkdirSync(studentFolderPath);
      }
      for (const event of studentReg.Events) {
        const handoutDescriptor = sheet.generateHandout(event);
        const handoutXml = sheet.generateXml({
          handouts: { handout: handoutDescriptor }
        });
        const basename = sheet.getHandoutBasenameFromEvent(event);
        await sheet.generateHandoutPdf(handoutXml, basename, studentFolderPath);
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    await closeDB();
  }
};
