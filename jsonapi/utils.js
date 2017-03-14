const { isString, isObject, isArray, isFunction } = require('lodash');
const async = require('async');

function genErrorObj(errors) {
  if (!isArray(errors) || errors.length === 0) {
    return [];
  }

  if (isString(errors[0])) {
    return {
      errors: errors.map(error => ({ title: error }))
    };
  } else if (isObject(errors[0])) {
    return {
      errors: errors.map(error => ({ title: error.title }))
    };
  }
  return [];
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkIfDbHasModel(modelName, db) {
  const models = Object.keys(db);
  if (!(models.find(item => item === modelName))) {
    return (genErrorObj([`model: '${modelName}' is not exist in database`]));
  }
  return true;
}

function checkIfModelIsAllowed(modelName, allowedModels, methodName) {
  if (!(allowedModels.find(item => item === modelName))) {
    return (genErrorObj([`model: '${modelName}' is not allowed for method: '${methodName}'`]));
  }
  return true;
}

function getAssociatedObjects(db, resource, modelName) {
  return new Promise((resolve, reject) => {
    const associationsGroup = db[modelName].associations;
    async.mapSeries(Object.keys(associationsGroup),
      (assocGroup, callback) => {
        const getFunc = `get${capitalizeFirstLetter(assocGroup)}`;
        if (!isFunction(resource[getFunc])) {
          callback(new Error(`${getFunc} is not a function on ${resource}`));
          return;
        }
        resource[getFunc]().then((result) => {
          if (isArray(result)) {
            const resultForm = result.map(item => ({
              id: item.id,
              type: item.Model.getTableName()
            }));
            callback(null, {
              [assocGroup]: resultForm
            });
          } else if (isObject(result)) {
            const resultForm = {
              id: result.id,
              type: result.Model.getTableName()
            };
            callback(null, {
              [assocGroup]: resultForm
            });
          } else {
            callback(null, {
              [assocGroup]: null
            });
          }
        }).catch((err) => {
          callback(err);
        });
      },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            relationships: result
          });
        }
      });
  });
}

module.exports = {
  checkIfDbHasModel,
  checkIfModelIsAllowed,
  capitalizeFirstLetter,
  getAssociatedObjects,
  genErrorObj
};
