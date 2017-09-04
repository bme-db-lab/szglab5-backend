const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecord, genJSONApiResByRecords, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    throw new Error('Not implemented exception');
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    if (isNaN(reqId)) {
      res.status(400).send(genErrorObj('Requested id is not a number'));
      return;
    }

    const db = getDB();
    db.ExerciseCategories.findById(reqIdNum)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'ExerciseCategories'))
      .then((response) => {
        const questions = response.data.relationships.Questions;
        if (questions === null) {
          res.status(404).send();
          return;
        }
        const ids = questions.data.map(item => item.id);
        db.Questions.findAll({ where: { id: ids } })
          .then(genJSONApiResByRecords.bind(null, db, 'Questions'))
          .then((responseQuestions) => {
            res.send(responseQuestions);
          })
          .catch((err) => {
            if (err.notFound) {
              res.status(404).send(genErrorObj(err.message));
              return;
            }
            res.status(500).send(genErrorObj(err.message));
          });
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
