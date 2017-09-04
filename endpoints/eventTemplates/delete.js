const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    throw new Error('Not implemented exception');
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    if (isNaN(reqId)) {
      res.status(400).send(genErrorObj('Requested id is not a number'));
      return;
    }
    logger.info("Deleting Event Template " + reqIdNum);

    const db = getDB();
    db.EventTemplates.destroy({ where: { id: reqIdNum }})
      .then(() => {
        res.status(200).send();
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
 * @api {delete} /event-templates/:id Delete Event Template
 * @apiName Delete
 * @apiGroup EventTemplates
 * @apiDescription Delete event template entry by id
 *
 * @apiParam {Number} [id] Event Template's id
 */
