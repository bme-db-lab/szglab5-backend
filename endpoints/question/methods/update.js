const Joi = require('joi');

const { getDB } = require('../../../db/db.js');
const schema = require('../schema');

/**
 * @api {path} /questions update
 * @apiName updateQuestion
 * @apiGroup Question
 *
 * @apiParamExample {json} Request-Example:
*     {
*       "data": {
*         "id": 2
*         "attributes": {
*           "text": "What is the meaning of life?",
*           "TestId": 1
*         },
*         "type": "questions"
*       }
*     }
* @apiSuccessExample {json} Success-Response:
* HTTP/1.1 204
}
 */
module.exports = (req, res) => {
  try {
    const db = getDB();
    const questionToUpdate = req.body.data.attributes;
    const id = req.body.data.id;
    const { error } = Joi.validate(questionToUpdate, schema);
    if (error) {
      res.status(400).send({
        errors: [error]
      });
      return;
    }
    db.Question.update(questionToUpdate, { where: { id } })
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        res.status(500).send({ error: [err.message] });
      });
  } catch (err) {
    res.status(500).send({ error: [err.message] });
  }
};
