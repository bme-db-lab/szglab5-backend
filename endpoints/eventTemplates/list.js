const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const userInfo = req.userInfo;
    console.log(userInfo);

    const records = await db.EventTemplates.findAll({
      include: [
        {
          model: db.ExerciseCategories,
          include: [
            {
              model: db.ExerciseSheets
            }
          ]
        },
        {
          model: db.DeliverableTemplates
        },
        {
          where: {
            DemonstratorId: userInfo.userId
          },
          model: db.Events,
          include: [
            {
              model: db.StudentRegistrations
            }
          ]
        }
      ]
    });
    const response = getJSONApiResponseFromRecords(db, 'EventTemplates', records, {
      includeModels: ['Events', 'DeliverableTemplates', 'ExerciseCategories', 'ExerciseSheets']
    });
    res.send(response);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

