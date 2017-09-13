const { initDB, closeDB } = require('../../db/db.js');
const inquirer = require('inquirer');

module.exports = async () => {
  try {
    const db = await initDB();

    const eventTemplates = await db.EventTemplates.findAll();
    const eventTemplateChoices = [];
    for (const eventTemplate of eventTemplates) {
      const exCat = await eventTemplate.getExerciseCategory();
      eventTemplateChoices.push({
        name: `${eventTemplate.dataValues.type} - ${eventTemplate.dataValues.seqNumber} - ${exCat.dataValues.type}`,
        value: eventTemplate.id
      });
    }

    const studentGroupPromptResult = await inquirer.prompt([
      {
        name: 'studentGroups',
        type: 'input',
        message: 'Student groups, with \',\' separator',
        default: 's8-2, s8-4, s8-6'
      },
      {
        type: 'list',
        name: 'eventTemplateId',
        message: 'Select event template',
        choices: eventTemplateChoices
      },
      {
        type: 'input',
        name: 'deadlineDate',
        message: 'New deadline date',
        default: '2017-09-15T21:59:59Z'
      }]
    );
    const studentGroupNames = studentGroupPromptResult.studentGroups.split(',');

    for (const studentGroupName of studentGroupNames) {
      console.log(studentGroupName);
      const studentGroup = await db.StudentGroups.find({
        name: studentGroupName
      });
      if (!studentGroup) {
        throw new Error(`Student group not found: ${studentGroupName}`);
      }
      const studentRegs = await studentGroup.getStudentRegistrations();
      for (const studentReg of studentRegs) {
        // const events = await studentReg.getEvents();
        const events = await db.Events.findAll({
          where: {
            StudentRegistrationId: studentReg.dataValues.id
          },
          include: {
            model: db.EventTemplates,
            where: {
              id: studentGroupPromptResult.eventTemplateId
            }
          }
        });
        for (const event of events) {
          // const deliverables = await event.getDeliverables();
          const deliverables = await db.Deliverables.findAll({
            where: {
              EventId: event.id
            },
            include: {
              model: db.DeliverableTemplates,
              where: {
                type: 'FILE'
              }
            }
          });
          for (const deliverable of deliverables) {
            const oldDeadline = deliverable.dataValues.deadline;
            const newDeadline = new Date(studentGroupPromptResult.deadlineDate);
            console.log(`id: ${deliverable.id}: ${oldDeadline} -> ${newDeadline}`);
            await db.Deliverables.update(
              {
                deadline: newDeadline,
              },
              {
                where: {
                  id: deliverable.id
                }
              }
            );
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    await closeDB();
  }
};
