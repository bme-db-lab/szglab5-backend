const { getDB } = require('../../db/db.js');

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
