const { getDB } = require('../../../db/db.js');

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
