const { initDB, closeDB } = require('../../db/db.js');
const inquirer = require('inquirer');

module.exports = async () => {
  try {
    const db = await initDB();

    const studentGroups = await db.StudentGroups.findAll();
    const studentGroupsChoices = [];
    for (const studentGroup of studentGroups) {
      studentGroupsChoices.push({
        name: studentGroup.name,
        value: studentGroup.id
      });
    }

    const eventTemplates = await db.EventTemplates.findAll();
    const eventTemplateChoices = [];
    for (const eventTemplate of eventTemplates) {
      const exCat = await eventTemplate.getExerciseCategory();
      eventTemplateChoices.push({
        name: `${eventTemplate.dataValues.type} - ${eventTemplate.dataValues.seqNumber} - ${exCat.dataValues.type}`,
        value: eventTemplate.id
      });
    }


    const groupPromptResult = await inquirer.prompt([
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

    const studentGroup = await db.StudentGroups.findById(groupPromptResult.studentGroupId);
    const demonstrator = await studentGroup.getUser();
    console.log(`Demonstrator: ${demonstrator.dataValues.displayName} current class room: ${demonstrator.dataValues.classroom}`);

    const newClassRoom = await inquirer.prompt({
      type: 'INPUT',
      message: 'New class room',
      name: 'classRoom'
    });

    await demonstrator.updateAttributes({
      classroom: newClassRoom.classRoom
    });

    const studentRegs = await studentGroup.getStudentRegistrations();
    for (const studentReg of studentRegs) {
      const event = await db.Events.findOne({
        include: [
          {
            model: db.EventTemplates,
            where: { id: groupPromptResult.eventTemplateId }
          },
          {
            model: db.StudentRegistrations,
            where: { id: studentReg.id }
          }
        ]
      });
      console.log(`Updaing - EventId: ${event.id} class room: ${event.location} -> ${newClassRoom.classRoom}`);
      await event.updateAttributes({
        location: newClassRoom.classRoom
      });
    }
  } catch (err) {
    console.log(err);
  } finally {
    closeDB();
  }
};
