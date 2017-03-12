const { getDB } = require('../../../db/db.js');

/**
 * @api {delete} /tests/:id delete
 * @apiName DeleteTest
 * @apiGroup Test
 *
 * @apiParam {Number} id Tests unique ID
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 204 No Content
 * {}
 */
module.exports = (req, res) => {
  const db = getDB();
  const { id } = req.params;
  try {
    db.Test.destroy({ where: { id } })
      .then((rows) => {
        console.log(rows);
        if (rows !== 0) {
          res.status(204).send();
        } else {
          res.status(404).send();
        }
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (err) {
    res.status(500).send(err);
  }
};
