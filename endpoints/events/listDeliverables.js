const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    if (isNaN(reqId)) {
      res.status(400).send(genErrorObj('Requested id is not a number'));
      return;
    }

    const db = getDB();
    db.Events.findById(reqIdNum)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'Events'))
      .then((response) => {
        const deliverables = response.data.relationships.Deliverables;
        if (deliverables === null) {
          res.status(404).send();
          return;
        }
        var ids = [];
        for (var i = 0, len = deliverables.data.length; i < len; i++)
          ids.push(deliverables.data[i].id);
        console.log(ids);
        db.Deliverables.findAll({ where: { id: ids } })
          .then((responseUser) => {
            res.send(responseUser);
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
 * @api {get} /events/:id/demonstrator Get Event's deliverables
 * @apiName Get Deliverables
 * @apiGroup Events
 * @apiDescription Get event's deliverables
 *
 * @apiParam {Number} [id] Event's id
 *
 * @apiSuccessExample Success-Response:
 * [
 *   {
 *     "id": 1,
 *     "deadline": "2017-03-30T12:11:17.576Z",
 *     "submitteddate": null,
 *     "grade": null,
 *     "comment": null,
 *     "url": null,
 *     "commit": null,
 *     "createdAt": "2017-05-06T20:47:29.824Z",
 *     "updatedAt": "2017-05-06T20:47:29.824Z",
 *     "EventId": 1,
 *     "DeliverableTemplateId": 1,
 *     "CorrectorId": 2,
 *     "UserId": null
 *   },
 *   {
 *     "id": 2,
 *     "deadline": "2017-03-30T12:11:17.576Z",
 *     "submitteddate": null,
 *     "grade": null,
 *     "comment": null,
 *     "url": null,
 *     "commit": null,
 *     "createdAt": "2017-05-06T20:47:29.824Z",
 *     "updatedAt": "2017-05-06T20:47:29.824Z",
 *     "EventId": 1,
 *     "DeliverableTemplateId": 2,
 *     "CorrectorId": null,
 *     "UserId": null
 *   }
 * ]
 */
