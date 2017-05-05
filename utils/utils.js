const { isString, isObject, isArray, isFunction } = require('lodash');
const async = require('async');
const pluralize = require('pluralize');

function genErrorObj(errors) {
  if (isString(errors)) {
    return {
      errors: [
        {
          title: errors
        }
      ]
    };
  }

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

function getAssociatedObjects(db, modelName, resource) {
  return new Promise((resolve, reject) => {
    const associationsGroup = db[modelName].associations;
    async.mapSeries(Object.keys(associationsGroup),
      (assocGroup, callback) => {
        const getFunc = `get${capitalizeFirstLetter(assocGroup)}`;
        if (!isFunction(resource[getFunc])) {
          callback(new Error(`${getFunc} is not a function on ${resource}`));
          return;
        }
        // TODO: refactor
        let links = null;
        if (modelName === 'Events' && assocGroup === 'Demonstrator') {
          links = {
            links: {
              related: `/${modelName.toLowerCase()}/${resource.dataValues.id}/${assocGroup.toLowerCase()}`
            }
          };
        }
        resource[getFunc]().then((result) => {
          if (isArray(result)) {
            // single objet
            const resultForm = result.map(item => ({
              id: item.id,
              type: item.Model.getTableName()
            }));
            callback(null, {
              [assocGroup]: Object.assign({}, {
                data: resultForm
              },
              links)
              // [assocGroup]: (links === null) ? {
              //   data: resultForm,
              // } : links
            });
          } else if (isObject(result)) {
            const resultForm = {
              id: result.id,
              type: result.Model.getTableName()
            };
            callback(null, {
              [assocGroup]: Object.assign({},
                {
                  data: resultForm
                },
                links
              )
              // [assocGroup]: (links === null) ? {
              //   data: resultForm,
              // } : links
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
          const resultObj = {};
          result.forEach((resultItem) => {
            Object.keys(resultItem).forEach((objKey) => {
              resultObj[objKey] = resultItem[objKey];
            });
          });
          resolve(resultObj);
        }
      });
  });
}

function getObject(db, queryObj) {
  return new Promise((resolve, reject) => {
    const modelName = pluralize.singular(queryObj.type);
    db[modelName].findById(queryObj.id)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getRelationshipObjects(db, relationships) {
  return new Promise((resolve, reject) => {
    const relationshipObjects = {};
    async.eachSeries(Object.keys(relationships),
      (relGroup, callbackGroup) => {
        const relGroupObj = relationships[relGroup].data;
        if (!isArray(relGroupObj)) {
          // get that obj
          getObject(db, relGroupObj)
            .then((res) => {
              if (res === null) {
                callbackGroup(new Error(`Resource Object not found, id: ${relGroupObj.id}, type: ${relGroupObj.type}`));
                return;
              }
              relationshipObjects[relGroup] = {
                id: relGroupObj.id,
                type: relGroupObj.type,
                obj: res
              };
              callbackGroup(null);
            })
            .catch((err) => {
              callbackGroup(err);
            });
        } else {
          relationshipObjects[relGroup] = [];
          async.eachSeries(relGroupObj,
            (relGroupItem, callbackInner) => {
              getObject(db, relGroupItem)
                .then((res) => {
                  if (res === null) {
                    callbackInner(new Error(`Resource Object not found, id: ${relGroupItem.id}, type: ${relGroupItem.type}`));
                    return;
                  }
                  relationshipObjects[relGroup].push({
                    id: relGroupItem.id,
                    type: relGroupItem.type,
                    obj: res
                  });
                  callbackInner(null);
                })
                .catch((err) => {
                  callbackInner(err);
                });
            },
            (err) => {
              if (err) {
                callbackGroup(err);
                return;
              }
              callbackGroup(null);
            });
        }
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(relationshipObjects);
        }
      });
  });
}

function _getSetFunc(type) {
  return `set${capitalizeFirstLetter(type)}`;
}

function setRelations(resource, relationGroups) {
  return new Promise((resolve, reject) => {
    async.eachSeries(Object.keys(relationGroups),
      (relGroup, callbackGroup) => {
        const relGroupObj = relationGroups[relGroup];
        if (isArray(relGroupObj)) {
          async.eachSeries(relGroupObj,
            (relGroupItem, callbackInner) => {
              const setFunc = _getSetFunc(relGroup);
              resource[setFunc](relGroupItem.obj)
                .then(() => callbackInner(null))
                .catch(err => callbackInner(err));
            },
            (err) => {
              if (err) {
                callbackGroup(err);
              } else {
                callbackGroup(null);
              }
            });
        } else {
          const setFunc = _getSetFunc(relGroup);
          resource[setFunc](relGroupObj.obj)
            .then(() => callbackGroup(null))
            .catch(err => callbackGroup(err));
        }
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  });
}

module.exports = {
  checkIfDbHasModel,
  checkIfModelIsAllowed,
  capitalizeFirstLetter,
  getAssociatedObjects,
  getRelationshipObjects,
  setRelations,
  genErrorObj
};
