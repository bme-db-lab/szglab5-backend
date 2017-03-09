const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  // TODO query the tests for the database and send back
  const db = getDB();
  db.Test.findAll({})
    .then((tests) => {
      const testsToSend = tests.map(test => ({
        type: 'Test',
        id: test.id,
        attributes: {
          title: test.title
        }
      }));
      res.send({
        data: testsToSend
      });
    })
    .catch((err) => {
      res.status(500).send({
        errors: [err]
      });
    });
};
