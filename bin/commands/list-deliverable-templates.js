const { initDB, closeDB } = require('../../db/db.js');
const inquirer = require('inquirer');

module.exports = async () => {
  try {
    const db = await initDB();

    const eventTemplates = await db.EventTemplates.findAll({
      include: [
        {
          model: db.DeliverableTemplates
        },
        {
          model: db.ExerciseCategories
        }
      ]
    });
    eventTemplates.forEach((eventTemplate) => {
      console.log(eventTemplate.ExerciseCategory.type);
      eventTemplate.DeliverableTemplates.forEach((deliverableTemplate) => {
        console.log(`  ${deliverableTemplate.name} - ${deliverableTemplate.type} : ${deliverableTemplate.description}`);
      });
    });
  } catch (err) {
    console.log(err);
  } finally {
    await closeDB();
  }
};
