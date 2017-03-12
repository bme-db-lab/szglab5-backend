const { getDB } = require('../../../db/db.js');

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
