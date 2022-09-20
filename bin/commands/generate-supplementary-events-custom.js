const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const moment = require('moment');

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
        message: 'json file',
        name: 'path'
      }
    ]);

    const jsonFile = fs.readFileSync(path.join(__dirname, 'data', prompt.path));
    const supplementaryConfig = JSON.parse(jsonFile);
    console.log('---------------------------');
    console.log('Supplementary config');
    console.log(supplementaryConfig);
    console.log('---------------------------');

    console.log('Generate StudentGroups and Appointments');
    const demonstrator = await db.Users.find({
      where: {
        loginName: supplementaryConfig.demonstrator
      }
    });
    if (!demonstrator) {
      throw new Error(`Demonstrator not found: ${supplementaryConfig.demonstrator}`);
    }
    const newStudentGroup = await db.StudentGroups.create({
      name: 'pot-a',
      SemesterId: 1,
      UserId: demonstrator.id,
      language: 'magyar'
    });

    await db.Appointments.create({
      date: supplementaryConfig.date,
      location: supplementaryConfig.location,
      StudentGroupId: newStudentGroup.id
    });

    for (const student of supplementaryConfig.students) {
      console.log(`Creating event for ${student.neptun}`);
      const studentReg = await db.StudentRegistrations.find({
        include: [
          {
            where: { neptun: student.neptun },
            model: db.Users,
          },
        ]
      });

      const newEvent = await db.Events.create({
        date: supplementaryConfig.date,
        location: supplementaryConfig.location,
        grade: null,
        finalized: false,
        comment: null,
        imsc: null,
        attempt: 2,
        DemonstratorId: demonstrator.id
      });
      await studentReg.addEvent(newEvent);

      const failedExerciseCategory = await db.ExerciseCategories.findById(student.exCat);
      // const failedExerciseCategory = failedEvent.ExerciseSheet.ExerciseCategory;

      // connect event-template
      const eventTemplate = await db.EventTemplates.find({
        where: { ExerciseCategoryId: failedExerciseCategory.id }
      });
      await newEvent.setEventTemplate(eventTemplate);
      const deliverableTemplates = await eventTemplate.getDeliverableTemplates();
      // generate deliverables
      console.log(`Event: loc - "${newEvent.location}" date - "${newEvent.dataValues.date}"`);
      for (const deliverableTemplate of deliverableTemplates) {
        console.log(` DeliverableTemplate: type - "${deliverableTemplate.dataValues.type}" name - "${deliverableTemplate.dataValues.name}" desc - "${deliverableTemplate.dataValues.description}"`);
        const eventDate = newEvent.date;
        const deadline = moment(eventDate).add(2, 'd');

        await db.Deliverables.create({
          deadline,
          EventId: newEvent.id,
          DeliverableTemplateId: deliverableTemplate.dataValues.id
        });
      }
      // connect exercise sheet
      const exSheet = await db.ExerciseSheets.find({
        where: {
          ExerciseCategoryId: failedExerciseCategory.id,
          ExerciseTypeId: student.exType
        }
      });
      await newEvent.update({
        ExerciseSheetId: exSheet.id
      });
    }
  } catch (err) {
    console.log(err);
  } finally {
    closeDB();
  }
};
