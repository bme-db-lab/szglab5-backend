const { genErrorObj } = require('../../utils/utils.js');
const { checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');

module.exports = (req, res) => {
  try {
    const { data } = req.body;
    logger.info("Deliverable added", data);
    const db = getDB();
    db.Deliverables.create(data.attributes)
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
 * @api {post} /deliverables Add Deliverable
 * @apiName Post
 * @apiGroup Deliverables
 * @apiDescription Add a deliverable
 *
 */