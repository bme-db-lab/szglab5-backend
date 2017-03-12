const { getDB } = require('../../../db/db.js');

/**
 * @api {get} /tests list
 * @apiName ListTests
 * @apiGroup Test
 *
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "data": [
 *     {
 *       "type": "tests",
 *       "id": 1,
 *       "attributes": {
 *         "title": "Könnyű teszt"
 *       }
 *     },
 *     {
 *       "type": "tests",
 *       "id": 4,
 *       "attributes": {
 *         "title": "szuper teszt"
 *       }
 *     }
 *   ]
 * }
 */
module.exports = (req, res) => {
  try {
    const db = getDB();
    db.Test.findAll({})
      .then((tests) => {
        const testsToSend = tests.map(test => ({
          type: 'tests',
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
        res.status(500).send({ errors: [err] });
      });
  } catch (err) {
    res.status(500).send({ errors: [err] });
  }
};
