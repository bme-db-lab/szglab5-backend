const { getDB } = require('../../../db/db.js');

/**
  * @api {get} /questions list
  * @apiName ListQuestions
  * @apiGroup Question
  *
  *
  * @apiSuccessExample {json} Success-Response:
  * HTTP/1.1 200 OK
  * {
  *   "data": [
  *     {
  *       "type": "questions",
  *       "id": 1,
  *       "attributes": {
  *         "text": "Question 1"
  *       }
  *     },
  *     {
  *       "type": "questions",
  *       "id": 4,
  *       "attributes": {
  *         "text": "szuper asdasd"
  *       }
  *     }
  *   ]
  * }
*/
module.exports = (req, res) => {
  try {
    const db = getDB();
    db.Question.findAll({})
      .then((testQuestions) => {
        const data = testQuestions.map(testQuestion => ({
          type: 'questions',
          id: testQuestion.id,
          attributes: {
            text: testQuestion.text
          }
        }));
        res.send({
          data
        });
      })
      .catch((err) => {
        res.status(500).send({
          errors: [err]
        });
      });
  } catch (err) {
    res.status(500).send({ errors: [err.message] });
  }
};
