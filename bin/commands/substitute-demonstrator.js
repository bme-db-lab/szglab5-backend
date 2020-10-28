const { initDB, closeDB } = require('../../db/db.js');
const inquirer = require('inquirer');

module.exports = async () => {
  try {
    const db = await initDB();

    const demonstrators = await db.Users.findAll({
      where: {},
      include: {
        model: db.Roles,
        where: {
          name: 'DEMONSTRATOR'
        }
      }
    });

    const demonstratorChoices = demonstrators.map(demonstrator => ({
      name: `${demonstrator.displayName} - ${demonstrator.email}`,
      value: demonstrator.id
    })).sort((a, b) => a.name.localeCompare(b.name));


    const eventTemplates = await db.EventTemplates.findAll();
    const eventTemplateChoices = [];
    for (const eventTemplate of eventTemplates) {
      const exCat = await eventTemplate.getExerciseCategory();
      eventTemplateChoices.push({
        name: `${eventTemplate.dataValues.type} - ${eventTemplate.dataValues.seqNumber} - ${exCat.dataValues.type}`,
        value: eventTemplate.id
      });
    }


    const sourcePromptResult = await inquirer.prompt([
      {
        type: 'list',
        name: 'eventTemplateId',
        message: 'Select event template',
        choices: eventTemplateChoices
      },
      {
        type: 'list',
        name: 'sourceDemonstratorId',
        message: 'Source demonstrator',
        choices: demonstratorChoices
      }
    ]);

    // get events by demonstrator / event template
    const events = await db.Events.findAll({
      where: {
        DemonstratorId: sourcePromptResult.sourceDemonstratorId,
        EventTemplateId: sourcePromptResult.eventTemplateId
      }
    });

    const uniqueDates = [...new Set(events.map(event => event.date.toString()))];
    const sourceDateChoices = uniqueDates.map(uniqueDate => ({
      name: uniqueDate,
      value: new Date(uniqueDate)
    }));

    const targetPromptResult = await inquirer.prompt([
      {
        type: 'list',
        name: 'sourceDate',
        message: 'Source date',
        choices: sourceDateChoices
      },
      {
        type: 'list',
        name: 'targetDemonstratorId',
        message: 'Target demonstrator',
        choices: demonstratorChoices
      }
    ]);

    // get events by demonstrator / event template
    const eventsByDate = await db.Events.findAll({
      where: {
        DemonstratorId: sourcePromptResult.sourceDemonstratorId,
        EventTemplateId: sourcePromptResult.eventTemplateId,
        date: targetPromptResult.sourceDate
      }
    });

    for (const event of eventsByDate) {
      console.log(`Updaing - EventId: ${event.id} EventDate: ${event.date} new demonstrator: ${targetPromptResult.targetDemonstratorId}`);
      await event.updateAttributes({
        DemonstratorId: targetPromptResult.targetDemonstratorId
      });
    }
  } catch (err) {
    console.log(err);
  } finally {
    closeDB();
  }
};
