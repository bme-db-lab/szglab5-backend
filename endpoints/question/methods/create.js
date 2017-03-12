const Joi = require('joi');

const { getDB } = require('../../../db/db.js');
const schema = require('../schema');

/**
 * @api {post} /questions create
 * @apiName createQuestion
 * @apiGroup Question
 *
 * @apiParamExample {json} Request-Example:
*     {
*       "data": {
*         "attributes": {
*           "text": "What is the meaning of life?",
*           "QuestionTypeId": 1
*         },
*         "type": "questions"
*       }
*     }
* @apiSuccessExample {json} Success-Response:
* HTTP/1.1 201 Created
* {
*  "data": {
*    "attributes": {
*      "text": "What is the meaning of life?"
*    },
*    "type": "questions",
*    "id": 7
*  }
}
 */
module.exports = (req, res) => {
  try {
    const db = getDB();
    const questionToSave = req.body.data.attributes;
    const { error } = Joi.validate(questionToSave, schema);
    if (error) {
      res.status(400).send({
        errors: [error]
      });
      return;
    }
    db.Question.create(questionToSave)
      .then((newQuestion) => {
        const { id, text } = newQuestion.dataValues;
        res.status(201).send({
          data: {
            attributes: {
              text
            },
            type: 'questions',
            id
          },
        });
      })
      .catch((err) => {
        res.status(500).send({ error: [err.message] });
      });
  } catch (err) {
    res.status(500).send({ error: [err.message] });
  }
};
