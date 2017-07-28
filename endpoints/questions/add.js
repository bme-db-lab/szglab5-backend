const { genErrorObj } = require('../../utils/utils.js');
const { checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    const { data } = req.body;
    const db = getDB();

    db.Questions.create(data.attributes)
      .then(checkIfExist)
      .then(() => {
        res.status(201).send();
      })
      .catch((err) => {
        if (err.notFound) {
          res.status(404).send(genErrorObj(err.message));
          return;
        }
        res.status(500).send(genErrorObj(err.message));
      });
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

/**
 * @api {post} /test-questions Add Test Question
 * @apiName Post
 * @apiGroup TestQuestions
 * @apiDescription Add a test question
 *
 */