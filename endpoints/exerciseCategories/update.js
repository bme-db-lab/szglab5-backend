const { genErrorObj } = require('../../utils/utils.js');
const { updateResource, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    throw new Error('Not implemented exception');
    const reqId = req.params.id;

    const { data } = req.body;
    const db = getDB();

    const exCatToUpdat = await db.ExerciseCategories.findById(reqId);
    checkIfExist(exCatToUpdat);
    await updateResource(db, 'ExerciseCategories', data, exCatToUpdat);
    res.status(204).send();
  } catch (err) {
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};

