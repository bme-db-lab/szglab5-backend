const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const appointments = await db.Appointments.findAll({ include: [{ all: true }] });
    const response = getJSONApiResponseFromRecords(db, 'Appointments', appointments, {
      includeModels: []
    });
    res.send(response);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

