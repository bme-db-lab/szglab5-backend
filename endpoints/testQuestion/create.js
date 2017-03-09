const Joi = require('joi');

const { getDB } = require('../../db/db.js');
const schema = require('./schema');

module.exports = (req, res) => {
  const db = getDB();
  const newQuestionObj = req.body;
  const { error } = Joi.validate(newQuestionObj, schema);
  if (error) {
    res.status(400).send({
      errors: [error]
    });
    return;
  }
  db.TestQuestion.create(newQuestionObj)
    .then(() => {
      res.status(201).send('Test question created!');
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
