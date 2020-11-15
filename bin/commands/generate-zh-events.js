const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const { initDB, closeDB } = require('../../db/db.js');

module.exports = async () => {
  try {
    const db = await initDB();
  
    const jsonFiles = fs.readdirSync(path.join(__dirname, 'data'));
    const jsonFileChoices =
      jsonFiles
        .filter(jsonFile => jsonFile.match(/.json$/g))
        .map(jsonFile => ({
          name: jsonFile,
          value: jsonFile
        }));

    const prompt = await inquirer.prompt([
      {
        type: 'list',
        choices: jsonFileChoices,
        message: 'json config file',
        name: 'path'
      },
    ]);

    // Read config JSON
    const zhConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', prompt.path)));
    console.log(zhConfig);

    const zhDemonstrator = await db.Users.findOne({
      where: {
        email_official: zhConfig.demonstrator
      }
    });

    // Create Exercise Category
    const zhExCat = await db.ExerciseCategories.create({
      type: zhConfig.exerciseCategory.type,
      CourseId: 1
    });
    // Create Exercise Types - Exercise Sheets
    const sheets = [];
    for (const exerciseType of zhConfig.exerciseTypes) {
      const exType = await db.ExerciseTypes.create({
        name: exerciseType.name,
        shortName: exerciseType.name,
        exerciseId: exerciseType.exerciseId,
        CourseId: 1,
        LanguageId: 1,
        GuruId: zhDemonstrator.id
      });

      const exSheet = await db.ExerciseSheets.create({
        ExerciseCategoryId: zhExCat.id,
        ExerciseTypeId: exType.id
      });
      sheets.push(exSheet);
    }
    // Create EventTemplate
    const zhEventTemplate = await db.EventTemplates.create({
      type: zhConfig.eventTemplate.type,
      seqNumber: zhConfig.eventTemplate.seqNumber,
      ExerciseCategoryId: zhExCat.id
    });
    // Create DeliverableTemplates
    const deliverableTemplates = [];
    for (let i = 0; i < zhConfig.deliverableTemplates.count; i++) {
      const baseName = `${zhConfig.deliverableTemplates.baseName}_${i + 1}`;

      const deliverableTemplate = await db.DeliverableTemplates.create({
        type: 'FILE',
        description: baseName,
        name: baseName,
        AKEP: false,
        EventTemplateId: zhEventTemplate.id
      });
      deliverableTemplates.push(deliverableTemplate);
    }

    // Create Events
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
          // exclude english student group
          where: {
            name: {
              $and: [
                { $ne: 'c16-a1' },
               { $ne: 'c16-a2' },
              ]
            }
          },
          model: db.StudentGroups,
          required: false
        }
      ]
    });

    let sheetCounter = 0;
    for (const studentReg of studentRegs) {
      console.log(`Creating event: ${studentReg.User.neptun} - sheetIndex: ${sheetCounter}`);
      // Create Event
      const event = await db.Events.create({
        date: zhConfig.date,
        location: 'Online',
        finalized: false,
        EventTemplateId: zhEventTemplate.id,
        StudentRegistrationId: studentReg.id,
        DemonstratorId: zhDemonstrator.id,
        ExerciseSheetId: sheets[sheetCounter].id
      });
      sheetCounter = sheetCounter < sheets.length - 1 ? sheetCounter + 1 : 0;
      // Create Deliverables
      for (const deliverableTemplate of deliverableTemplates) {
        await db.Deliverables.create({
          deadline: zhConfig.deadline,
          grading: false,
          DeliverableTemplateId: deliverableTemplate.id,
          EventId: event.id
        });
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    closeDB();
  }
};
