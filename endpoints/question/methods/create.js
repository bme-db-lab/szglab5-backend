const Joi = require('joi');

const { getDB } = require('../../../db/db.js');
const schema = require('../schema');

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
