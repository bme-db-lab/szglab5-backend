const { getDB } = require('../../../db/db.js');

/**
  * @api {get} /questions/:id get
  * @apiName GetQuestion
  * @apiGroup Question
  *
  * @apiParam {Number} id Questions unique ID
  *
  * @apiSuccessExample {json} Success-Response:
  * HTTP/1.1 200 OK
  * {
  *  "data": {
  *    "type": "questions",
  *    "id": 7,
  *    "attributes": {
  *      "text": "What is the meaning of life?"
  *    }
  *  }
  * }
*/
module.exports = (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    db.Question.findById(id)
      .then((question) => {
        if (question === null) {
          res.status(404).send({ errors: [`Question not found with ID: ${id}`] });
          return;
        }
        const data = {
          type: 'questions',
          id: question.id,
          attributes: {
            text: question.text
          }
        };
        res.send({
          data
        });
      })
      .catch((err) => {
        res.status(500).send({ errors: [err.message] });
      });
  } catch (err) {
    res.status(500).send({ errors: [err.message] });
  }
};