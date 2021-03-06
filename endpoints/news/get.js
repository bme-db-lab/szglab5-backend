const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);

    const db = getDB();
    const record = await db.News.findById(
      reqIdNum,
      {
        include: {
          model: db.Users,
          as: 'publisher',
          attributes: ['id', 'displayName', 'email']
        }
      }
    );
    checkIfExist(record);
    const response = getJSONApiResponseFromRecord(db, 'News', record, {
      includeModels: ['Users']
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

