const pluralize = require('pluralize');
const { genErrorObj, checkIfModelIsAllowed, checkIfDbHasModel, getAssociatedObjects } = require('./utils.js');
const { getDB } = require('../db/db.js');
const logger = require('../utils/logger.js');

const allowedModels = [
  'test',
  'language',
  'question'
];

const methodName = 'relation';

module.exports = (req, res) => {
  try {
    const db = getDB();
    const { modelNamePlural, id, modelNamePluralRel } = req.params;
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
    // TODO check resourceToSave attributes to schema
    // all check passed
    db[modelName].findById(id)
      .then((resource) => {
        if (resource === null) {
          res.status(404).send(genErrorObj([`Model(${modelName}) does not exist with id ${id}`]));
          return;
        }
        getAssociatedObjects(db, resource, modelName)
          .then((objects) => {
            logger.info(objects);
            res.status(400).send('TODO');
          })
          .catch((err) => {
            res.status(500).send(genErrorObj([err.message]));
          });
      })
      .catch((err) => {
        res.status(500).send(genErrorObj([err.message]));
      });
  } catch (err) {
    res.status(500).send(genErrorObj([err.message]));
  }
};
