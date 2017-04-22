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
* @api {get} /events/:id Get Event
 * @apiName Get
 * @apiGroup Events
 * @apiDescription Get event information with id
 *
 * @apiParam {Number} [id] Event's id
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "data": {
 *     "id": 1,
 *     "date": "2017-03-30T12:11:17.576Z",
 *     "location": "IL105",
 *     "attempt": 0,
 *     "createdAt": "2017-03-30T12:20:00.471Z",
 *     "updatedAt": "2017-03-30T12:20:00.471Z",
 *     "StudentRegistrationId": 1
 *   },
 *   "relationships": {
 *     "StudentRegistration": {
 *       "data": {
 *         "id": 1,
 *         "type": "StudentRegistrations"
 *       }
 *     }
 *   }
 * }
 *
 */
