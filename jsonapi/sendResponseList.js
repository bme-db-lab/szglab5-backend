const pluralize = require('pluralize');
const { genErrorObj, checkIfModelIsAllowed, checkIfDbHasModel } = require('./utils.js');
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
        const resourcesToSend = resources.map((resource) => {
          // TODO resource.dataValues return all the attributes
          const attributes = resource.dataValues;
          return {
            type: modelNamePlural,
            id: resource.id,
            attributes
          };
        });
        res.send({
          data: resourcesToSend
        });
      })
      .catch((err) => {
        res.status(500).send(genErrorObj([err.message]));
      });
  } catch (err) {
    console.log(err);
    res.status(500).send(genErrorObj([err.message]));
  }
};
