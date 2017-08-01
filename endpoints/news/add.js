const { genErrorObj } = require('../../utils/utils.js');
const { checkIfExist, genJSONApiResByRecord } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');

module.exports = (req, res) => {
  try {
    const { data } = req.body;

    if (req.userInfo) {
      data.attributes.publisherId = req.userInfo.userId;
    }
    data.attributes.published = new Date();
    const db = getDB();
    db.News.create(data.attributes)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'News'))
      .then((response) => {
        res.status(201).send(response);
      })
      .catch((err) => {
        if (err.notFound) {
          res.status(404).send(genErrorObj(err.message));
          return;
        }
        res.status(500).send(genErrorObj(err.message));
      });
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};
