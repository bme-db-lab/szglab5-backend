const { genErrorObj } = require('../../utils/utils.js');
const { updateResource, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    const reqId = req.params.id;

    const { data } = req.body;
    const db = getDB();
    db.Events.findById(reqId)
      .then(updateResource.bind(null, db, 'Events', data))
      .then(checkIfExist)
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
 * @api {patch} /events/:id. Update Event
 * @apiName Patch
 * @apiGroup Events
 * @apiDescription Update an event
 *
 */
