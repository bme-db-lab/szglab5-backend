const { genErrorObj } = require('../../utils/utils.js');
const { checkIfExist, getJSONApiResponseFromRecord, createResource } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const { data } = req.body;

    if (req.userInfo) {
      data.attributes.publisherId = req.userInfo.userId;
    }
    data.attributes.published = new Date();
    const db = getDB();
    const createdNews = await createResource(db, 'News', data);
    checkIfExist(createdNews);
    const response = getJSONApiResponseFromRecord(db, 'News', createdNews);
    res.send(response);
  } catch (err) {
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};
