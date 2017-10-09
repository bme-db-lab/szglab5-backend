const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const records = await db.ExerciseTypes.findAll({
      include: [
        {
          model: db.ExerciseSheets
        },
        {
          model: db.StudentRegistrations
        }
      ],
      order: ['shortName']
    });
    const response = getJSONApiResponseFromRecords(db, 'ExerciseTypes', records, {
      includeModels: []
    });
    res.send(response);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

