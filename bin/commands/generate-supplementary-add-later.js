const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const moment = require('moment');

const { initDB, closeDB } = require('../../db/db.js');

module.exports = async () => {
  try {
    const db = await initDB();

    const exerciseCategories = await db.ExerciseCategories.findAll();
    const exCatChoices = exerciseCategories.map((excat) => ({
      name: excat.type,
      value: excat.id,
    }));

    const exerciseTypes = await db.ExerciseTypes.findAll();
    const exTypeChoices = exerciseTypes.map((exType) => ({
      name: exType.shortName,
      value: exType.id,
    }));

    const appointments = await db.Appointments.findAll({
      include: [
        {
          model: db.StudentGroups,
          where: {
            name: {
              $iLike: '%pot%',
            },
          },
          include: {
            model: db.Users,
          },
        },
      ],
    });

    const appointmentChoices = appointments.map((appointment) => ({
      name: `${appointment.date} - ${appointment.StudentGroup.name} - ${appointment.StudentGroup.User.email_official}`,
      value: appointment
    }));

    const supplementaryConfig = await inquirer.prompt([
      {
        type: 'input',
        name: 'neptun',
        message: 'Neptun',
      },
      {
        type: 'list',
        name: 'exCat',
        message: 'Exercise Category',
        choices: exCatChoices,
      },
      {
        type: 'list',
        name: 'exType',
        message: 'Exercise Type',
        choices: exTypeChoices,
      },
      {
        type: 'list',
        name: 'appointment',
        message: 'Appointment',
        choices: appointmentChoices,
      },
    ]);

    console.log('---------------------------');
    console.log('Supplementary config');
    console.log(supplementaryConfig);
    console.log('---------------------------');

    const demonstrator = await db.Users.find({
      where: {
        email_official:
          supplementaryConfig.appointment.StudentGroup.User.email_official,
      },
    });
    if (!demonstrator) {
      throw new Error(
        `Demonstrator not found: ${supplementaryConfig.demonstrator}`
      );
    }

    console.log(`Creating event for ${supplementaryConfig.neptun}`);
    const studentReg = await db.StudentRegistrations.find({
      include: [
        {
          where: { neptun: supplementaryConfig.neptun },
          model: db.Users,
        },
      ],
    });

    const newEvent = await db.Events.create({
      date: supplementaryConfig.appointment.date,
      location: supplementaryConfig.appointment.location,
      grade: null,
      finalized: false,
      comment: null,
      imsc: null,
      attempt: 2,
      DemonstratorId: demonstrator.id,
    });
    await studentReg.addEvent(newEvent);

    const failedExerciseCategory = await db.ExerciseCategories.findById(
      supplementaryConfig.exCat
    );
    // const failedExerciseCategory = failedEvent.ExerciseSheet.ExerciseCategory;

    // connect event-template
    const eventTemplate = await db.EventTemplates.find({
      where: { ExerciseCategoryId: failedExerciseCategory.id },
    });
    await newEvent.setEventTemplate(eventTemplate);
    const deliverableTemplates = await eventTemplate.getDeliverableTemplates();
    // generate deliverables
    console.log(
      `Event: loc - "${newEvent.location}" date - "${newEvent.dataValues.date}"`
    );
    for (const deliverableTemplate of deliverableTemplates) {
      console.log(
        ` DeliverableTemplate: type - "${deliverableTemplate.dataValues.type}" name - "${deliverableTemplate.dataValues.name}" desc - "${deliverableTemplate.dataValues.description}"`
      );
      const eventDate = newEvent.date;
      const deadline = moment(eventDate).add(1, 'd');

      await db.Deliverables.create({
        deadline,
        EventId: newEvent.id,
        DeliverableTemplateId: deliverableTemplate.dataValues.id,
      });
    }
    // connect exercise sheet
    const exSheet = await db.ExerciseSheets.find({
      where: {
        ExerciseCategoryId: failedExerciseCategory.id,
        ExerciseTypeId: supplementaryConfig.exType,
      },
    });
    await newEvent.update({
      ExerciseSheetId: exSheet.id,
    });
  } catch (err) {
    console.log(err);
  } finally {
    closeDB();
  }
};
