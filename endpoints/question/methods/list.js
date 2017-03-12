const { getDB } = require('../../../db/db.js');

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
