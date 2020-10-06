const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    const { roles } = req.userInfo;

    let include = []
    // only ADMIN DEMONSTRATOR CORRECTOR should get included data
    if (roles.includes('ADMIN') || roles.includes('DEMONSTRATOR') || !roles.includes('CORRECTOR')) {
      include.push({ all: true })
    }

    const db = getDB();
    const record = await db.ExerciseTypes.findById(
      reqIdNum,
      { include: include }
    );
    checkIfExist(record);
    const response = getJSONApiResponseFromRecord(db, 'ExerciseTypes', record, {
      includeModels: []
    });
    res.send(response);
  } catch (err) {
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};

