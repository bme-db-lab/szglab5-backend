const { getDB } = require('../../../db/db.js');

/**
 * @api {delete} /questions/:id delete
 * @apiName DeleteQuestion
 * @apiGroup Question
 *
 * @apiParam {Number} id Questions unique ID
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 204 No Content
 * {}
 */
module.exports = (req, res) => {
  const db = getDB();
  const { id } = req.params;
  try {
    db.Question.destroy({ where: { id } })
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
