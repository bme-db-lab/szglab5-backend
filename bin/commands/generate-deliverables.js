const inquirer = require('inquirer');
const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');

module.exports = async () => {
  try {
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
      logger.debug(`Event: loc - "${event.dataValues.location}" date - "${event.dataValues.date}"`);
      for (const deliverableTemplate of deliverableTemplates) {
        logger.debug(` DeliverableTemplate: type - "${deliverableTemplate.dataValues.type}" name - "${deliverableTemplate.dataValues.name}" desc - "${deliverableTemplate.dataValues.description}"`);
        const eventDate = event.dataValues.date;
        eventDate.setDate(eventDate.getDate() + 10);
        await db.Deliverables.create({
          deadline: eventDate,
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
