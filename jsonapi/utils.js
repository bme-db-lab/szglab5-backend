const { isString, isObject, isArray } = require('lodash');

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


module.exports = {
  checkIfDbHasModel,
  checkIfModelIsAllowed,
  genErrorObj
};
