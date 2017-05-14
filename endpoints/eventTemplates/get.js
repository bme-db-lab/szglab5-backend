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
    db.EventTemplates.findById(reqIdNum)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'EventTemplates'))
      .then((response) => {
        res.send(response);
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
 * @api {get} /event-templates/:id Get Event Template
 * @apiName Get
 * @apiGroup EventTemplates
 * @apiDescription Get event template information by id
 *
 * @apiParam {Number} [id] Event Template's id
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": {
 *     "id": 1,
 *     "type": "EventTemplates",
 *     "attributes": {
 *       "title": "SQL",
 *       "number": 5,
 *       "createdAt": "2017-05-06T12:00:00.000Z",
 *       "updatedAt": "2017-05-08T19:12:56.725Z"
 *     },
 *     "relationships": {
 *       "Events": {
 *         "data": []
 *       }
 *     }
 *   }
 * }
 */
