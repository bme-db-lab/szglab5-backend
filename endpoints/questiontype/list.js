const { getDB } = require('../../db/db.js');

/**
 * @api {get} /questiontypes list
 * @apiName ListQuestionTypes
 * @apiGroup QuestionType
 *
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "data": [
 *    {
 *     "type": "QuestionType",
 *       "id": 1,
 *       "attributes": {
 *         "name": "Oracle"
 *       }
 *     },
 *     {
 *       "type": "QuestionType",
 *       "id": 2,
 *       "attributes": {
 *         "name": "SQL"
 *       }
 *     },
 *     {
 *       "type": "QuestionType",
 *       "id": 3,
 *       "attributes": {
 *         "name": "DBM"
 *       }
 *     }
 *   ]
 *  }
 */
module.exports = (req, res) => {
  // TODO query the tests for the database and send back
  try {
    const db = getDB();
    db.QuestionType.findAll({})
      .then((tests) => {
        const questionTypesData = tests.map(questionType => ({
          type: 'QuestionType',
          id: questionType.id,
          attributes: {
            name: questionType.name
          }
        }));
        res.send({
          data: questionTypesData
        });
      })
      .catch((err) => {
        res.status(500).send({ errors: [err] });
      });
  } catch (err) {
    res.status(500).send({ errors: [err] });
  }
};
