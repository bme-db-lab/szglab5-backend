const { initDB, closeDB } = require('../../db/db.js');

module.exports = async () => {
  try {
    const db = await initDB();

    const eventTemplates = await db.EventTemplates.findAll({
      include: [
        {
          model: db.ExerciseCategories
        },
        {
          where: { attempt: 2 },
          model: db.Events,
          include: [
            // {
            //   model: db.Deliverables,
            //   include: {
            //     model: db.DeliverableTemplates,
            //     where: { type: 'FILE' }
            //   }
            // },
            {
              where: {},
              model: db.ExerciseSheets,
              include: {
                model: db.ExerciseTypes,
                where: { shortName: '22-AUTO' }
              }
            }
          ]
        }
      ]
    });

    const exCategories = eventTemplates.map(eventTemplate => eventTemplate.ExerciseCategory.type);
    const stats = {};
    exCategories.forEach((exCategory) => {
      stats[exCategory] = 0;
    });
    for (const eventTemplate of eventTemplates) {
      for (const event of eventTemplate.Events) {
        stats[eventTemplate.ExerciseCategory.type]++;
      }
    }
    console.log(stats);
  } catch (err) {
    console.log(err);
  } finally {
    closeDB();
  }
};
