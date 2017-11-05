const inquirer = require('inquirer');
const moment = require('moment');

const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');

module.exports = async (argv) => {
  try {
    const confirmPromptResult = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'res',
        message: 'Are you sure?'
      }
    ]);
    if (!confirmPromptResult.res) {
      throw new Error('Confirmation error!');
    }

    const options = {
      resetExistingDeliverables: argv.resetExistingDeliverables || false
    };

    const db = await initDB();
    // prompt for user eventTemplate
    const eventTemplates = await db.EventTemplates.findAll();
    const eventTemplateChoices = [];
    for (const eventTemplate of eventTemplates) {
      const exCat = await eventTemplate.getExerciseCategory();
      eventTemplateChoices.push({
        name: `${eventTemplate.dataValues.type} - ${eventTemplate.dataValues.seqNumber} - ${exCat.dataValues.type}`,
        value: eventTemplate.id
      });
    }
    const eventTemplateChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Please select a course',
        choices: eventTemplateChoices
      }
    ]);
    // iterate through event-template's events
    const eventTemplate = await db.EventTemplates.findById(eventTemplateChoice.id);
    const events = await eventTemplate.getEvents();
    const deliverableTemplates = await eventTemplate.getDeliverableTemplates();
    logger.info('Generating Deliverables!');
    for (const event of events) {
      // check if event has any deliverables
      const deliverables = await event.getDeliverables();
      if (deliverables.length !== 0) {
        console.log('Event already has deliverables!');
        if (options.resetExistingDeliverables) {
          console.log('Remove existing deliverables ...');
          // remove existing deliverables
          for (const deliverable of deliverables) {
            await deliverable.destroy();
          }
          console.log('Deliverables has been removed!');
        } else {
          // skip deliverable creation
          continue;
        }
      }

      logger.debug(`Event: loc - "${event.dataValues.location}" date - "${event.dataValues.date}"`);
      for (const deliverableTemplate of deliverableTemplates) {
        logger.debug(` DeliverableTemplate: type - "${deliverableTemplate.dataValues.type}" name - "${deliverableTemplate.dataValues.name}" desc - "${deliverableTemplate.dataValues.description}"`);
        const eventDate = event.dataValues.date;
        const deadline = moment(eventDate).add(1, 'd').add(15, 'm');

        await db.Deliverables.create({
          deadline,
          EventId: event.dataValues.id,
          DeliverableTemplateId: deliverableTemplate.dataValues.id
        });
      }
    }
    logger.info('Generating Deliverables succeed!');
  } catch (err) {
    throw err;
  } finally {
    await closeDB();
  }
};
