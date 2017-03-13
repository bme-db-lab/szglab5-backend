const Joi = require('joi');

const { getDB } = require('../../../db/db.js');
const schema = require('../schema');

/**
 * @api {path} /tests update
 * @apiName updateTest
 * @apiGroup Test
 *
 * @apiParamExample {json} Request-Example:
*     {
*       "data": {
*         "id": 2
*         "attributes": {
*           "text": "What is the meaning of life?",
*           "TestId": 1
*         },
*         "type": "tests"
*       }
*     }
* @apiSuccessExample {json} Success-Response:
* HTTP/1.1 204
 */
module.exports = (req, res) => {
  try {
    const db = getDB();
    const testToUpdate = req.body.data.attributes;
    const id = req.body.data.id;
    const { error } = Joi.validate(testToUpdate, schema);
    if (error) {
      res.status(400).send({
        errors: [error]
      });
      return;
    }
    db.Test.update(testToUpdate, { where: { id } })
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
