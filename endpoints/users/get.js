const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);

    const db = getDB();

    const record = await db.Users.findById(
      reqIdNum,
      {
        include: [
          {
            model: db.Roles
          },
          {
            model: db.ExerciseTypes
          },
          {
            model: db.StudentRegistrations
          }
        ],
        attributes: ['id', 'loginName', 'displayName', 'email', 'subscribedToMailList', 'subscribedToEmailNotify', 'neptun', 'email_official']
      }
    );
    checkIfExist(record);
    const response = getJSONApiResponseFromRecord(db, 'Users', record, {
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

