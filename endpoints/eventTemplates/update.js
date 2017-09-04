const { genErrorObj } = require('../../utils/utils.js');
const { updateResource, checkIfExist } = require('../../utils/jsonapi.js');
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

    const { data } = req.body;
    const db = getDB();
    db.EventTemplates.findById(reqId)
      .then(checkIfExist)
      .then(updateResource.bind(null, db, 'EventTemplates', data))
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
 * @api {patch} /event-templates/:id Update EventTemplates
 * @apiName Patch
 * @apiGroup EventTemplates
 * @apiDescription Update an event template
 *
 */
