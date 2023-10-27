const config = require('../../config/config.js');
const { initDB, closeDB } = require('../../db/db.js');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const moment = require('moment');

module.exports = async (argv) => {
  try {
    const db = await initDB();

    const jsonFiles = fs.readdirSync(path.join(__dirname, 'data'));

    const jsonFileChoices = jsonFiles
      .filter(jsonFile => jsonFile.match(/.json$/g))
      .map(jsonFile => ({
        name: jsonFile,
        value: jsonFile
      }));

    const studentGroups = await db.StudentGroups.findAll();
    const studentGroupsChoices = [];
    for (const studentGroup of studentGroups) {
      studentGroupsChoices.push({
        name: studentGroup.name,
        value: studentGroup.id
      });
    }

    const prompt = await inquirer.prompt([
      {
        type: 'list',
        choices: jsonFileChoices,
        message: 'json file',
        name: 'path'
      },
      {
        type: 'list',
        name: 'studentGroupId',
        message: 'Student group where modify',
        choices: studentGroupsChoices
      }
    ]);
    // read File
    const jsonFile = fs.readFileSync(path.join(__dirname, 'data', prompt.path));
    const appointments = JSON.parse(jsonFile);
    console.log(appointments);

    const createdAppointments = [];
    // Create Appointments
    for (let i = 0; i < appointments.length; i++) {
      const createdAppointment = await db.Appointments.create({
        location: appointments[i].location,
        date: new Date(appointments[i].date),
        EventTemplateId: appointments[i].eventTemplateId,
        StudentGroupId: prompt.studentGroupId,
      });
      createdAppointments.push(createdAppointment);
    }
    // Create Events
    const appointmentsDb = await db.Appointments.findAll({ where: { StudentGroupId: prompt.studentGroupId } });
    const studentRegs = await db.StudentRegistrations.findAll({ where: { StudentGroupId: prompt.studentGroupId } });

    const appointmentsToUse = argv.onlyNew ? createdAppointments : appointmentsDb;
    
    for (const studentReg of studentRegs) {
      for (const appointment of appointmentsToUse) {
        // const exerciseSheet = await db.ExerciseSheets.findOne({ where: { ExerciseCategoryId: appointment.dataValues.ExerciseCategoryId, ExerciseTypeId: sr.dataValues.ExerciseTypeId } });
        const eventTemplate = await appointment.getEventTemplate();
        const studentGroup = await db.StudentGroups.findOne({ where: { id: studentReg.dataValues.StudentGroupId } });
        const exerciseSheet = await db.ExerciseSheets.findOne({ where: { ExerciseCategoryId: eventTemplate.dataValues.ExerciseCategoryId, ExerciseTypeId: studentReg.dataValues.ExerciseTypeId } });

        const eventToSeed = {
          date: moment(appointment.dataValues.date),
          location: appointment.dataValues.location,
          StudentRegistrationId: studentReg.dataValues.id,
          EventTemplateId: eventTemplate.id,
          ExerciseSheetId: exerciseSheet.dataValues.id,
          DemonstratorId: studentGroup.UserId
        };
        const event = await db.Events.create(eventToSeed);

        const deliverableTemplates = await eventTemplate.getDeliverableTemplates();
        console.log(`Event: loc - "${event.dataValues.location}" date - "${event.dataValues.date}"`);
        for (const deliverableTemplate of deliverableTemplates) {
          console.log(` DeliverableTemplate: type - "${deliverableTemplate.dataValues.type}" name - "${deliverableTemplate.dataValues.name}" desc - "${deliverableTemplate.dataValues.description}"`);
          const eventDate = event.dataValues.date;
          const deadline = moment(eventDate).add(config.defaultDeadlineDays, 'd');

          await db.Deliverables.create({
            deadline,
            EventId: event.dataValues.id,
            DeliverableTemplateId: deliverableTemplate.dataValues.id
          });
        }
      }
    }
    // Create Deliverables
  } catch (err) {
    console.log(err);
  } finally {
    await closeDB();
  }
};
