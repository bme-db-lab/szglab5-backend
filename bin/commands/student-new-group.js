const { initDB, closeDB } = require('../../db/db.js');
const inquirer = require('inquirer');


module.exports = async () => {
  try {
    const db = await initDB();
    const studentNeptunResult = await inquirer.prompt([
      {
        type: 'input',
        name: 'neptun',
        default: 'N42GXH',
        message: 'Users\'s Neptun'
      }
    ]);

    const student = await db.Users.find({
      where: { neptun: studentNeptunResult.neptun },
      include: {
        model: db.StudentRegistrations,
        include: {
          model: db.StudentGroups
        }
      }
    });
    if (!student) {
      throw new Error('Student not found!');
    }

    console.log(`Current student group is: ${student.dataValues.StudentRegistrations[0].dataValues.StudentGroup.name}`);

    const eventTemplates = await db.EventTemplates.findAll();
    const eventTemplateChoices = [];
    for (const eventTemplate of eventTemplates) {
      const exCat = await eventTemplate.getExerciseCategory();
      eventTemplateChoices.push({
        name: `${eventTemplate.dataValues.type} - ${eventTemplate.dataValues.seqNumber} - ${exCat.dataValues.type}`,
        value: eventTemplate.id
      });
    }

    const studentGroups = await db.StudentGroups.findAll();
    const studentGroupsChoices = [];
    for (const studentGroup of studentGroups) {
      studentGroupsChoices.push({
        name: studentGroup.name,
        value: studentGroup.id
      });
    }


    const newGroupPromptResult = await inquirer.prompt([
      {
        type: 'list',
        name: 'eventTemplateId',
        message: 'Select event template',
        choices: eventTemplateChoices
      },
      {
        type: 'list',
        name: 'studentGroupId',
        message: 'New student group',
        choices: studentGroupsChoices
      }
    ]);

    // get event to update
    const eventToUpdate = await db.Events.find({
      where: {
        EventTemplateId: newGroupPromptResult.eventTemplateId
      },
      include: {
        model: db.StudentRegistrations,
        include: {
          model: db.Users,
          where: {
            neptun: studentNeptunResult.neptun
          }
        }
      }
    });
    if (!eventToUpdate) {
      throw new Error('Event not found!');
    }
    console.log('Current event to update:');
    console.log(eventToUpdate.dataValues);


    // get new Appointment
    const appointment = await db.Appointments.find({
      where: {
        StudentGroupId: newGroupPromptResult.studentGroupId,
        EventTemplateId: newGroupPromptResult.eventTemplateId
      }
    });
    if (!appointment) {
      throw new Error('Appointment not found!');
    }
    // get new StudentGroup
    const studentGroup = await db.StudentGroups.findById(newGroupPromptResult.studentGroupId, {
      include: {
        model: db.Users
      }
    });
    if (!studentGroup) {
      throw new Error('Student group not found!');
    }
    console.log('New student group demonstrator:');
    console.log(studentGroup.User.dataValues);


    console.log('Every information gained:');
    const updateEventInfo = {
      location: appointment.dataValues.location,
      date: appointment.dataValues.date,
      DemonstratorId: studentGroup.dataValues.UserId
    };
    console.log(updateEventInfo);
    console.log('Updating student\'s event');
    const updatedEvent = await db.Events.update(
      {
        date: updateEventInfo.date,
        location: updateEventInfo.location,
        DemonstratorId: updateEventInfo.DemonstratorId
      },
      {
        where: { id: eventToUpdate.id }
      }
    );
    console.log('Event updated');
    console.log(updatedEvent);
  } catch (err) {
    console.log(err);
  } finally {
    await closeDB();
  }
};
