const pluralize = require('pluralize');
const { genErrorObj, checkIfModelIsAllowed, checkIfDbHasModel, getRelationshipObjects, setRelations } = require('./utils.js');
const { getDB } = require('../db/db.js');
const logger = require('../utils/logger.js');

const allowedModels = [
  'test',
  'language',
  'question'
];

const methodName = 'update';

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
    // TODO check resourceToSave attributes to schema
    // all check passed
    const resourceToUpdate = req.body.data.attributes;
    const { relationships } = req.body.data;
    if (!relationships && resourceToUpdate) {
      db[modelName].update(resourceToUpdate, { where: { id } })
        .then((rows) => {
          logger.info(rows);
          res.status(204).send();
        })
        .catch((err) => {
          res.status(500).send(genErrorObj([err.message]));
        });
    } else {
      getRelationshipObjects(db, relationships)
        .then((relGroups) => {
          db[modelName].findById(id).then((resource) => {
            if (resource === null) {
              res.status(404).send(genErrorObj([`Model(${modelName}) does not exist with id ${id}`]));
              return;
            }
            if (resourceToUpdate) {
              db[modelName].update(resourceToUpdate, { where: { id } })
                .then(() => {
                  setRelations(resource, relGroups)
                    .then(() => {
                      res.status(204).send();
                    })
                    .catch((err) => {
                      res.status(500).send(genErrorObj([err.message]));
                    });
                })
                .catch((err) => {
                  res.status(500).send(genErrorObj([err.message]));
                });
            } else {
              setRelations(resource, relGroups)
                .then(() => {
                  res.status(204).send();
                })
                .catch((err) => {
                  res.status(500).send(genErrorObj([err.message]));
                });
            }
          })
          .catch((err) => {
            res.status(500).send(genErrorObj([err.message]));
          });
        })
        .catch((err) => {
          res.status(500).send(genErrorObj([err.message]));
        });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send(genErrorObj([err.message]));
  }
};
