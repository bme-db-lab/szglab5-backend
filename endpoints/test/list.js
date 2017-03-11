const { getDB } = require('../../db/db.js');

/**
 * @api {get} /test list Tests
 * @apiName ListTests
 * @apiGroup Test
 *
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
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
