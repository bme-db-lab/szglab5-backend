const { genErrorObj } = require('../../utils/utils.js');
const { checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');

module.exports = (req, res) => {
  try {
    const { data } = req.body;
    logger.info(data);
    const db = getDB();
    db.Tests.create(data.attributes)
      .then(checkIfExist)
      .then(() => {
        res.status(201).send();
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

/**
 * @api {post} /tests Add Test
 * @apiName Post
 * @apiGroup Tests
 * @apiDescription Add a test
 *
 */
