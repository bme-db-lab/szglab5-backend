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
    db.Questions.findById(reqIdNum)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'Questions'))
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
 * @api {get} /test-questions/:id Get TestQuestion
 * @apiName Get
 * @apiGroup TestQuestions
 * @apiDescription Get test question information by id
 *
 * @apiParam {Number} [id] Test question's id
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": {
 *     "id": 1,
 *     "type": "TestQuestions",
 *     "attributes": {
 *       "text": "Question 1",
 *       "createdAt": "2017-03-08T17:40:23.839Z",
 *       "updatedAt": "2017-03-08T17:40:23.839Z"
 *     },
 *     "relationships": {}
 *   }
 * }
 */
