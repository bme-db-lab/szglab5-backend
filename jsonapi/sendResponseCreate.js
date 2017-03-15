const pluralize = require('pluralize');
const { genErrorObj, checkIfModelIsAllowed, checkIfDbHasModel, getRelationshipObjects, setRelations } = require('./utils.js');
const { getDB } = require('../db/db.js');

const allowedModels = [
  'test',
  'language',
  'question'
];

const methodName = 'create';

module.exports = (req, res) => {
  try {
    const db = getDB();
    const { modelNamePlural } = req.params;
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

    // TODO check resourceToSave attributes to schema
    const resourceToSave = req.body.data.attributes;
    const { relationships } = req.body.data;
    if (!relationships) {
      db[modelName].create(resourceToSave)
        .then((resource) => {
          const attributes = resource.dataValues;
          const resourcesToSend = {
            type: modelNamePlural,
            id: resource.id,
            attributes
          };
          res.send({
            data: resourcesToSend
          });
        })
        .catch((err) => {
          res.status(500).send(genErrorObj([err.message]));
        });
    } else {
      getRelationshipObjects(db, relationships)
        .then((relGroups) => {
          // all relationships object ready
          db[modelName].create(resourceToSave)
            .then((resource) => {
              setRelations(resource, relGroups)
                .then(() => {
                  const attributes = resource.dataValues;
                  const resourcesToSend = {
                    type: modelNamePlural,
                    id: resource.id,
                    attributes
                  };
                  res.send({
                    data: resourcesToSend
                  });
                })
                .catch((err) => {
                  res.status(500).send(genErrorObj([err.message]));
                });
            })
            .catch((err) => {
              res.status(500).send(genErrorObj([err.message]));
            })
          .catch((err) => {
            res.status(500).send(genErrorObj([err.message]));
          });
        })
        .catch((err) => {
          res.status(404).send(genErrorObj([err.message]));
        });
    }
  } catch (err) {
    res.status(500).send(genErrorObj([err.message]));
  }
};
