const { checkIfDbHasModel } = require('./utils.js');
const logger = require('./logger.js');
const { isPlainObject } = require('lodash');
const uppercamelcase = require('uppercamelcase');

function checkIfExist(record) {
  if (record === null) {
    const error = new Error('Record not found!');
    error.notFound = true;
    throw error;
  }
  return record;
}

function getJSONapiObj(record, models, currentOptions) {
  const attributes = {};
  const relationships = {};
  const included = [];

  for (const innerKeyName of Object.keys(record.dataValues)) {
    const attrConstructorName = record.dataValues[innerKeyName] !== null ? record.dataValues[innerKeyName].constructor.name : null;

    if (models.find(item => item === attrConstructorName)) {
      relationships[innerKeyName] = {
        data: {
          type: attrConstructorName,
          id: record.dataValues[innerKeyName].dataValues.id
        }
      };
      // add to included if its present in options
      if (currentOptions.includeModels.find(includeModelName => includeModelName === attrConstructorName)) {
        const checkIfExistItem = included.find(include => include.type === attrConstructorName
        && include.id === record.dataValues[innerKeyName].dataValues.id);
        if (!checkIfExistItem) {
          included.push({
            type: attrConstructorName,
            id: record.dataValues[innerKeyName].dataValues.id,
            attributes: record.dataValues[innerKeyName].dataValues
          });
        }
      }
    } else if ((Array.isArray(record.dataValues[innerKeyName]))) {
      // array relation
      console.log('Array TODOOO');
    } else {
      attributes[innerKeyName] = record.dataValues[innerKeyName];
    }
  }

  return {
    attributes,
    relationships,
    included
  };
}

function getJSONApiResponseFromRecord(db, modelName, record, options) {
  const _defaultOptions = {
    includeModels: []
  };
  const currentOptions = Object.assign(_defaultOptions, options);

  const recordData = record.dataValues;
  const models = Object.keys(db);

  const attributes = {};
  const relationships = {};
  const included = [];
  for (const keyName of Object.keys(recordData)) {
    const attrConstructorName = recordData[keyName] !== null ? recordData[keyName].constructor.name : null;
    // Check if its a database model instance
    if (models.find(item => item === attrConstructorName)) {
      relationships[keyName] = {
        data: {
          type: attrConstructorName,
          id: recordData[keyName].dataValues.id
        }
      };
      // INNER checking for 2nd level including
      // check for attributes
      const innerAttributes = {};
      const innerRelationships = {};

      for (const innerKeyName of Object.keys(recordData[keyName].dataValues)) {
        const innerAttrConstructorName = recordData[keyName].dataValues[innerKeyName] !== null ? recordData[keyName].dataValues[innerKeyName].constructor.name : null;

        if (models.find(item => item === innerAttrConstructorName)) {

          for (const innerInnerKeyname of Object.keys(recordData[keyName].dataValues[innerKeyName].dataValues)) {
            const innerInnerAttrConstructorName = recordData[keyName].dataValues[innerKeyName].dataValues[innerInnerKeyname].dataValues !== null ? recordData[keyName].dataValues[innerKeyName].dataValues[innerInnerKeyname].constructor.name : null;
            if (models.find(item => item === innerInnerAttrConstructorName)) {
              // add to included if its present in options
              if (currentOptions.includeModels.find(includeModelName => includeModelName === innerInnerAttrConstructorName)) {
                const checkIfExistItem = included.find(include => include.type === innerInnerAttrConstructorName
                && include.id === recordData[keyName].dataValues[innerKeyName].dataValues[innerInnerKeyname].dataValues.id);
                if (!checkIfExistItem) {
                  included.push({
                    type: innerInnerAttrConstructorName,
                    id: recordData[keyName].dataValues[innerKeyName].dataValues[innerInnerKeyname].dataValues.id,
                    attributes: recordData[keyName].dataValues[innerKeyName].dataValues[innerInnerKeyname].dataValues,
                  });
                }
              }
            }
          }

          // get ready for 3rd level
          const innerInnerObj = getJSONapiObj(recordData[keyName].dataValues[innerKeyName], models, currentOptions);
          innerRelationships[innerKeyName] = {
            data: {
              type: innerAttrConstructorName,
              id: recordData[keyName].dataValues[innerKeyName].dataValues.id
            }
          };
          // add to included if its present in options
          if (currentOptions.includeModels.find(includeModelName => includeModelName === innerAttrConstructorName)) {
            const checkIfExistItem = included.find(include => include.type === innerAttrConstructorName
            && include.id === recordData[keyName].dataValues[innerKeyName].dataValues.id);
            if (!checkIfExistItem) {
              included.push({
                type: innerAttrConstructorName,
                id: recordData[keyName].dataValues[innerKeyName].dataValues.id,
                attributes: innerInnerObj.attributes,
                relationships: innerInnerObj.relationships
              });
            }
          }
        } else if ((Array.isArray(recordData[keyName].dataValues[innerKeyName]))) {
          // array relation
          innerRelationships[innerKeyName] = {
            data: []
          };
          for (const innerData of recordData[keyName].dataValues[innerKeyName]) {
            innerRelationships[innerKeyName].data.push({
              id: innerData.dataValues.id,
              type: innerData.constructor.name
            });
            if (currentOptions.includeModels.find(includeModelName => includeModelName === attrConstructorName)) {
              const innerArrayObj = getJSONapiObj(innerData, models, currentOptions);
              const checkIfExistItem = included.find(include => include.type === innerData.constructor.name
                && include.id === innerData.dataValues.id);
              if (!checkIfExistItem) {
                included.push({
                  type: innerData.constructor.name,
                  id: innerData.dataValues.id,
                  attributes: innerArrayObj.attributes,
                  relationships: innerArrayObj.relationships
                });
              }
            }
          }
        } else {
          innerAttributes[innerKeyName] = recordData[keyName].dataValues[innerKeyName];
        }
      }
      // add to included if its present in options
      if (currentOptions.includeModels.find(includeModelName => includeModelName === attrConstructorName)) {
        const checkIfExistItem = included.find(include => include.type === recordData[keyName].constructor.name
          && include.id === recordData[keyName].dataValues.id);
        if (!checkIfExistItem) {
          included.push({
            type: attrConstructorName,
            id: recordData[keyName].dataValues.id,
            attributes: innerAttributes,
            relationships: innerRelationships
          });
        }
      }
    } else if (Array.isArray(recordData[keyName])) {
      relationships[keyName] = {
        data: []
      };
      for (const innerData of recordData[keyName]) {
        const innerAttrConstructorName = innerData.constructor.name;
        relationships[keyName].data.push({
          type: innerAttrConstructorName,
          id: innerData.dataValues.id
        });
        const innerObj = getJSONapiObj(innerData, models, currentOptions);
        for (const include of innerObj.included) {
          const checkIfExistItem = included.find(alreadyInclude => alreadyInclude.type === innerAttrConstructorName
            && alreadyInclude.id === include.attributes.id);
          if (!checkIfExistItem) {
            included.push(include);
          }
        }

        // add to included if its present in options
        if (currentOptions.includeModels.find(includeModelName => includeModelName === innerAttrConstructorName)) {

          included.push({
            type: innerAttrConstructorName,
            id: innerData.dataValues.id,
            attributes: innerObj.attributes,
            relationships: innerObj.relationships
          });
        }
      }
    } else {
      attributes[keyName] = recordData[keyName];
    }
  }

  return {
    data: {
      id: record.id,
      type: modelName,
      attributes,
      relationships,
    },
    included
  };
}

function getJSONApiResponseFromRecords(db, modelName, records, options) {
  const result = {
    data: [],
    included: []
  };
  for (const record of records) {
    const recordResult = getJSONApiResponseFromRecord(db, modelName, record, options);
    result.data.push(recordResult.data);
    result.included.push(...recordResult.included);
  }
  return result;
}

async function updateResource(db, modelName, data) {
  const id = data.id;
  const attributes = data.attributes;
  delete attributes.createdAt;
  delete attributes.updatedAt;
  await db[modelName].update(attributes, { where: { id } });
}

async function createResource(db, modelName, data) {
  const createdResource = await db[modelName].create(data.attributes);
  for (const relationKey of Object.keys(data.relationships)) {
    if (data.relationships[relationKey].data !== null && isPlainObject(data.relationships[relationKey].data)) {
      const type = uppercamelcase(data.relationships[relationKey].data.type);
      const objToSet = await db[type].findById(data.relationships[relationKey].data.id);
      const setFuncName = `set${relationKey}`;
      await createdResource[setFuncName](objToSet);
    }
  }

  return createdResource;
}

module.exports = {
  getJSONApiResponseFromRecord,
  getJSONApiResponseFromRecords,
  updateResource,
  createResource,
  checkIfExist
};
