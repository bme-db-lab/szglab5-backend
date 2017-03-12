const { getDB } = require('../../../db/db.js');

/**
 * @api {get} /tests/:id get
 * @apiName getTest
 * @apiGroup Test
 *
 * @apiParam {Number} id Tests unique ID
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "data": {
 *    "type": "tests",
 *    "id": 3,
 *    "attributes": {
 *      "title": "Szuper teszt"
 *    }
 *  }
 * }
 */
module.exports = (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    db.Test.findById(id)
      .then((test) => {
        if (test === null) {
          res.status(404).send({ errors: [`Test not found with ID: ${id}`] });
          return;
        }
        const data = {
          type: 'tests',
          id: test.id,
          attributes: {
            title: test.title
          }
        };
        res.send({
          data
        });
      })
      .catch((err) => {
        res.status(500).send({ errors: [err.message] });
      });
  } catch (err) {
    res.status(500).send({ errors: [err.message] });
  }
};
