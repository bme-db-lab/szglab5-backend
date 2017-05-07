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
    db.Tests.findById(reqIdNum)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'Tests'))
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
 * @api {get} /deliverables/:id Get Test
 * @apiName Get
 * @apiGroup Tests
 * @apiDescription Get test information by id
 *
 * @apiParam {Number} [id] Test's id
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": {
 *     "id": 1,
 *     "type": "Tests",
 *     "attributes": {
 *       "title": null,
 *       "createdAt": "2017-03-08T17:40:23.824Z",
 *       "updatedAt": "2017-03-08T17:40:23.824Z"
 *     },
 *     "relationships": {
 *       "TestQuestions": {
 *         "data": [
 *           {
 *             "id": 1,
 *             "type": "TestQuestions"
 *           },
 *           {
 *             "id": 2,
 *             "type": "TestQuestions"
 *           }
 *         ]
 *       }
 *     }
 *   }
 * }
 */
