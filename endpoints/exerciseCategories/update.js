const { genErrorObj } = require('../../utils/utils.js');
const { updateResource, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');

module.exports = (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    if (isNaN(reqId)) {
      res.status(400).send(genErrorObj('Requested id is not a number'));
      return;
    }

    const { data } = req.body;
    logger.info(data);
    const db = getDB();
    db.ExerciseCategories.findById(reqId)
      .then(checkIfExist)
      .then(updateResource.bind(null, db, 'ExerciseCategories', data))
      .then(() => {
        res.status(204).send();
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
* @api {patch} /exercise-categories/:id Update Exercise Category
 * @apiName Patch
 * @apiGroup ExerciseCategories
 * @apiDescription Update an exercise category
 *
 */