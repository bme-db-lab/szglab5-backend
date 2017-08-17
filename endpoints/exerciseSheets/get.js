const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    if (isNaN(reqId)) {
      res.status(400).send(genErrorObj('Requested id is not a number'));
      return;
    }

    const db = getDB();
    const exerciseSheet = await db.ExerciseSheets.findById(reqIdNum);
    checkIfExist();
    const response = await genJSONApiResByRecord(db, 'ExerciseSheets', exerciseSheet);
    response.included = [];
    // Included: Exercise Category
    if (response.data.relationships.ExerciseCategory.data !== null) {
      const exCat = await db.ExerciseCategories.findById(response.data.relationships.ExerciseCategory.data.id);
      response.included.push({
        id: exCat.dataValues.id,
        type: 'ExerciseCategories',
        attributes: exCat.dataValues
      });
    }
    res.send(response);
  } catch (err) {
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};
