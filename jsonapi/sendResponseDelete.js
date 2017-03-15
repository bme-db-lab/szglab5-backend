const pluralize = require('pluralize');
const { genErrorObj, checkIfModelIsAllowed, checkIfDbHasModel } = require('./utils.js');
const { getDB } = require('../db/db.js');


const allowedModels = [
  'test',
  'language',
  'question'
];

const methodName = 'delete';

module.exports = (req, res) => {
  try {
    const db = getDB();
    const { modelNamePlural, id } = req.params;
    const modelName = pluralize.singular(modelNamePlural);
    // check if model exist
    const modellExistRet = checkIfDbHasModel(modelName, db);
    if (modellExistRet !== true) {
      res.status(400).send(modellExistRet);
      return;
    }
    // check is method is allowed
    const modelAllowRet = checkIfModelIsAllowed(modelName, allowedModels, methodName);
    if (modelAllowRet !== true) {
      res.status(400).send(modelAllowRet);
      return;
    }
    // all check passed
    db[modelName].destroy({ where: { id } })
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
    console.log(err);
    res.status(500).send(genErrorObj([err.message]));
  }
};
