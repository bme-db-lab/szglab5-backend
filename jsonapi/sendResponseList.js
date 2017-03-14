const pluralize = require('pluralize');
const async = require('async');
const { genErrorObj, checkIfModelIsAllowed, checkIfDbHasModel, getAssociatedObjects } = require('./utils.js');
const { getDB } = require('../db/db.js');


const allowedModels = [
  'test',
  'language',
  'question'
];

const methodName = 'list';

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
    db[modelName].findAll({})
      .then((resources) => {
        async.mapSeries(resources,
          (resource, callback) => {
            const attributes = resource.dataValues;
            // sync things
            const syncPart = {
              type: modelNamePlural,
              id: resource.id,
              attributes
            };
            // async things
            getAssociatedObjects(db, resource, modelName)
              .then((assoc) => {
                const relationships = assoc;
                callback(null, Object.assign({}, syncPart, relationships));
              })
              .catch((err) => {
                callback(err);
              });
          },
          (err, result) => {
            if (err) {
              res.status(500).send(genErrorObj([err.message]));
              return;
            }
            res.send({
              data: result,
            });
          });
      })
      .catch((err) => {
        res.status(500).send(genErrorObj([err.message]));
      });
  } catch (err) {
    res.status(500).send(genErrorObj([err.message]));
  }
};


// const associations = db[modelName].associations;
// const relationships = {};
//
// Object.keys(associations).forEach((assoc) => {
//   const getFunc = `get${capitalizeFirstLetter(assoc)}`;
//   resource[getFunc]().then((obj) => {
//     console.log(obj);
//   });
//   relationships[assoc] = {
//
//   };
