const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  // TODO query the tests for the database and send back
  const db = getDB();
  db.TestQuestion.findAll({})
    .then((testQuestions) => {
      const data = testQuestions.map(testQuestion => ({
        type: 'TestQuestion',
        id: testQuestion.id,
        attributes: {
          title: testQuestion.text
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
};
