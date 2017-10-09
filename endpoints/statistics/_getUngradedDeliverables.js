const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('../../utils/utils.js');

// http://expressjs.com/en/api.html#req.query
// localhost:7000/statistics/student?studentId=1
module.exports = async (req, res) => {
  try {
    const db = getDB();
    const types = [];

    const typeQuery = await db.ExerciseTypes.findAll();
    for (const type of typeQuery) {
      const typeRes = {
        id: type.dataValues.id,
        name: type.dataValues.shortName,
        num: 0
      };
      const sheetQuery = await type.getExerciseSheets();
      for (const sheet of sheetQuery) {
        const eventQuery = await sheet.getEvents();
        for (const event of eventQuery) {
          const deliverableQuery = await event.getDeliverables();
          for (const deliverable of deliverableQuery) {
            const template = await deliverable.getDeliverableTemplate();
            if (template.dataValues.type === 'FILE' &&
              (deliverable.dataValues.grade === undefined ||
                deliverable.dataValues.grade === null ||
                deliverable.dataValues.grade === '')) {
              typeRes.num += 1;
            }
          }
        }
      }
      types.push(typeRes);
    }

    res.send({ headers: ['id', 'name', 'num'], data: types });
  } catch (error) {
    res.status(500).send(genErrorObj(error.message));
  }
};
