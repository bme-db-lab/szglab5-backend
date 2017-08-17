const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const exerciseSheets = await db.ExerciseSheets.findAll();
    const response = await genJSONApiResByRecords(db, 'ExerciseSheets', exerciseSheets);
    response.included = [];
    for (const deliverable of response.data) {
      // Included: Deliverable-Templates
      if (deliverable.relationships.ExerciseCategory.data !== null) {
        const exCat = await db.ExerciseCategories.findById(deliverable.relationships.ExerciseCategory.data.id);
        response.included.push({
          id: exCat.dataValues.id,
          type: 'ExerciseCategories',
          attributes: exCat.dataValues
        });
      }
    }

    res.send(response);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};
