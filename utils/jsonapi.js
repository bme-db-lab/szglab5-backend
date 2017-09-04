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
      console.log('Array TODO');
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
          innerRelationships[innerKeyName] = {
            data: {
              type: innerAttrConstructorName,
              id: recordData[keyName].dataValues[innerKeyName].dataValues.id
            }
          };
          // add to included if its present in options
          if (currentOptions.includeModels.find(includeModelName => includeModelName === attrConstructorName)) {
            const checkIfExistItem = included.find(include => include.type === innerAttrConstructorName
            && include.id === recordData[keyName].dataValues[innerKeyName].dataValues.id);
            if (!checkIfExistItem) {
              included.push({
                type: innerAttrConstructorName,
                id: recordData[keyName].dataValues[innerKeyName].dataValues.id,
                attributes: recordData[keyName].dataValues[innerKeyName].dataValues
              });
            }
          }
        } else if ((Array.isArray(recordData[keyName].dataValues[innerKeyName]))) {
          // array relation
          console.log('Array TODO');
        } else {
          innerAttributes[innerKeyName] = recordData[keyName].dataValues[innerKeyName];
        }
      }
      // add to included if its present in options
      if (currentOptions.includeModels.find(includeModelName => includeModelName === attrConstructorName)) {
        included.push({
          type: attrConstructorName,
          id: recordData[keyName].dataValues.id,
          attributes: innerAttributes,
          relationships: innerRelationships
        });
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
  await db[modelName].update(attributes, { where: { id } });
}

module.exports = {
  getJSONApiResponseFromRecord,
  getJSONApiResponseFromRecords,
  updateResource,
  checkIfExist
};
