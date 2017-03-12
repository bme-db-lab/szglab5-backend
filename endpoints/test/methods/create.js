const Joi = require('joi');

const { getDB } = require('../../../db/db.js');
const schema = require('../schema');

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
