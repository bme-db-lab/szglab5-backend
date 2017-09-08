const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecord, updateResource, checkIfExist } = require('../../utils/jsonapi.js');
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
    db.Deliverables.findById(reqIdNum)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'Deliverables'))
      .then((response) => {
        const event = response.data.relationships.Event;
        if (event == null) {
          res.status(404).send();
          return;
        }
        db.Events.findById(event.data.id)
          .then(updateResource.bind(null, db, 'Events', data))
          .then(() => {
            res.status(204).send();
          }).catch((err) => {
            if (err.notFound) {
              res.status(404).send(genErrorObj(err.message));
              return;
            }
            res.status(500).send(genErrorObj(err.message));
          });
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
 * @api {patch} /deliverables/:id/event Update Deliverable's Event
 * @apiName Patch
 * @apiGroup Deliverables
 * @apiDescription Update a deliverable's event
 *
 */
