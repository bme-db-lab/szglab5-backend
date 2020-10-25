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


    const promptResult = await inquirer.prompt([
      {
        type: 'list',
        name: 'eventTemplateId',
        message: 'Select event template',
        choices: eventTemplateChoices
      },
      {
        type: 'list',
        name: 'demonstrator1Id',
        message: 'Swap Demonstrator 1',
        choices: demonstratorChoices
      },
      {
        type: 'list',
        name: 'demonstrator2Id',
        message: 'Swap Demonstrator 2',
        choices: demonstratorChoices
      }
    ]);

    // get events by demonstrator / event template
    const events1 = await db.Events.findAll({
      where: {
        DemonstratorId: promptResult.demonstrator1Id,
        EventTemplateId: promptResult.eventTemplateId
      },
    });

    const events2 = await db.Events.findAll({
      where: {
        DemonstratorId: promptResult.demonstrator2Id,
        EventTemplateId: promptResult.eventTemplateId
      },
    });

    for (const event of events1) {
      console.log(`Updaing - EventId: ${event.id} prev demonstrator: ${promptResult.demonstrator1Id} -> ${promptResult.demonstrator2Id}`);
      await event.updateAttributes({
        DemonstratorId: promptResult.demonstrator2Id
      });
    }

    for (const event of events2) {
      console.log(`Updaing - EventId: ${event.id} prev demonstrator: ${promptResult.demonstrator2Id} -> ${promptResult.demonstrator1Id}`);
      await event.updateAttributes({
        DemonstratorId: promptResult.demonstrator1Id
      });
    }
  } catch (err) {
    console.log(err);
  } finally {
    closeDB();
  }
};
