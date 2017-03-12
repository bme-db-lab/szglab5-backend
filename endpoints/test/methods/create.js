const Joi = require('joi');

const { getDB } = require('../../../db/db.js');
const schema = require('../schema');

/**
 * @api {post} /tests create
 * @apiName CreateTest
 * @apiGroup Test
 *
 *
 * @apiParamExample {json} Request-Example:
*     {
*       "data": {
*         "attributes": {
*           "title": "Szuper teszt",
*         },
*         "type": "tests"
*       }
*     }
* @apiSuccessExample {json} Success-Response:
* HTTP/1.1 201 Created
* {
*  "data": {
*    "attributes": {
*      "text": "Szuper teszt"
*    },
*    "type": "tests",
*    "id": 3
*  }
 */
module.exports = (req, res) => {
  try {
    const db = getDB();
    const testToSave = req.body.data.attributes;
    const { error } = Joi.validate(testToSave, schema);
    if (error) {
      res.status(400).send({ errors: [error] });
      return;
    }
    db.Test.create(testToSave)
      .then((newTest) => {
        const { id, title } = newTest.dataValues;
        res.status(201).send({
          data: {
            attributes: {
              title
            },
            type: 'tests',
            id
          },
        });
      })
      .catch((err) => {
        res.status(500).send({ errors: [err.message] });
      });
  } catch (err) {
    res.status(500).send({ errors: [err.message] });
  }
};
