const { checkIfDbHasModel } = require('./utils.js');
const logger = require('./logger.js');

function checkIfExist(record) {
  if (record === null) {
    const error = new Error('Record not found!');
    error.notFound = true;
    throw error;
  }
  return record;
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
      // add to included if its present in options
      if (currentOptions.includeModels.find(includeModelName => includeModelName === attrConstructorName)) {
        included.push({
          type: attrConstructorName,
          id: recordData[keyName].dataValues.id,
          attributes: recordData[keyName].dataValues
        });
      }
    } else if (Array.isArray(recordData[keyName])) {
      relationships[keyName] = [];
      for (const innerData of recordData[keyName]) {
        const innerAttrConstructorName = innerData.constructor.name;
        relationships[keyName].push({
          data: {
            type: innerAttrConstructorName,
            id: innerData.dataValues.id
          }
        });
        // add to included if its present in options
        if (currentOptions.includeModels.find(includeModelName => includeModelName === innerAttrConstructorName)) {
          included.push({
            type: innerAttrConstructorName,
            id: innerData.dataValues.id,
            attributes: innerData.dataValues
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
  await db[modelName].update(attributes, { where: { id } });
}

module.exports = {
  getJSONApiResponseFromRecord,
  getJSONApiResponseFromRecords,
  updateResource,
  checkIfExist
};
