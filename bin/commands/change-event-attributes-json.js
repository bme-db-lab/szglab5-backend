const config = require('../../config/config.js');
const { initDB, closeDB } = require('../../db/db.js');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

module.exports = async (argv) => {
  try {
    const db = await initDB();
    console.log(argv);
    const options = {
      resetDeliverables: argv.resetDeliverables || false,
      deadlineDay: argv.deadlineDay || config.defaultDeadlineDays
    };

    const studentGroups = await db.StudentGroups.findAll();
    const studentGroupsChoices = [];
    for (const studentGroup of studentGroups) {
      studentGroupsChoices.push({
        name: studentGroup.name,
        value: studentGroup.id
      });
    }

    const jsonFiles = fs.readdirSync(path.join(__dirname, 'data'));
    console.log(jsonFiles);

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
      },
      {
        type: 'list',
        name: 'studentGroupId',
        message: 'Student group where modify',
        choices: studentGroupsChoices
      }
    ]);

    const jsonFile = fs.readFileSync(path.join(__dirname, 'data', prompt.path));
    const eventAttributes = JSON.parse(jsonFile);

    const studentGroup = await db.StudentGroups.findById(prompt.studentGroupId);
    const studentRegs = await studentGroup.getStudentRegistrations();
    for (const studentReg of studentRegs) {
      for (const eventAttribute of eventAttributes) {
        const event = await db.Events.findOne({
          include: [
            {
              model: db.EventTemplates,
              where: { id: eventAttribute.eventTemplateId }
            },
            {
              model: db.StudentRegistrations,
              where: { id: studentReg.id }
            }
          ]
        });

        if (eventAttribute.date) {
          console.log(`Updaing - EventId: ${event.id} date: ${event.dataValues.date} -> ${eventAttribute.date}`);
          await event.updateAttributes({
            date: eventAttribute.date
          });
          // update deliverables date
          console.log('Modify deliverables deadline');
          const deliverables = await event.getDeliverables();
          for (const deliverable of deliverables) {
            const deadline = moment(eventAttribute.date).add(options.deadlineDay, 'd');
            await db.Deliverables.update(
              {
                deadline
              },
              {
                where: { id: deliverable.id },
                include: {
                  model: db.DeliverableTemplates,
                  where: {
                    type: 'FILE'
                  }
                }
              }
            );
            if (options.resetDeliverables) {
              await db.Deliverables.update(
                {
                  lastSubmittedDate: null,
                  grading: false,
                  grade: null,
                  imsc: 0,
                  finalized: false,
                  comment: null,
                  uploaded: false,
                  filePath: null,
                  originalFileName: null,
                  CorrectorId: null
                },
                {
                  where: { id: deliverable.id },
                  include: {
                    model: db.DeliverableTemplates,
                    where: {
                      type: 'FILE'
                    }
                  }
                }
              );
            }
          }

          // change appointment data
          console.log('Updating student group\'s appointments');
          const appointment = await db.Appointments.find({
            where: {
              StudentGroupId: studentGroup.id,
              EventTemplateId: eventAttribute.eventTemplateId
            }
          });
          if (appointment) {
            await appointment.updateAttributes({
              date: eventAttribute.date
            });
          }
        }
        if (eventAttribute.demonstrator) {
          const demonstrator = await db.Users.find({
            where: {
              loginName: eventAttribute.demonstrator
            }
          });

          if (!demonstrator) {
            throw new Error(`Demonstrator not found: ${eventAttribute.demonstrator}`);
          }

          console.log(`Updaing - EventId: ${event.id} demonstrator: ${event.DemonstratorId} -> ${demonstrator.id}`);
          await event.updateAttributes({
            DemonstratorId: demonstrator.id
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    await closeDB();
  }
};
