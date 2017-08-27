const { getAssociatedObjects } = require('./utils.js');
const async = require('async');
const logger = require('./logger.js');

function checkIfExist(record) {
  if (record === null) {
    const error = new Error('Record not found!');
    error.notFound = true;
    throw error;
  }
  return record;
}

function genJSONApiResByRecord(db, modelName, record) {
  return new Promise((resolve, reject) => {
    // logger.debug(`GET: ${modelName}`, record.dataValues);
    // logger.info(`GET: ${modelName}/${record.dataValues.id}`);
    getAssociatedObjects(db, modelName, record)
      .then((relationships) => {
        const data = record.dataValues;
        const pureAttributes = JSON.parse(JSON.stringify(data));
        if (pureAttributes.id) {
          delete pureAttributes.id;
        }
        if (modelName === 'Users') {
          delete pureAttributes.password;
        }
        resolve({
          data: {
            id: data.id,
            type: modelName,
            attributes: pureAttributes,
            relationships
          }
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function genJSONApiResByRecords(db, modelName, records) {
  return new Promise((resolve, reject) => {
    async.mapSeries(records,
      (record, callback) => {
        genJSONApiResByRecord(db, modelName, record)
          .then((singleResponse) => {
            callback(null, singleResponse.data);
          })
          .catch((err) => {
            callback(err);
          });
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve({ data: result });
      }
    );
  });
}

async function updateResource(db, modelName, data) {
  const id = data.id;
  const attributes = data.attributes;
  await db[modelName].update(attributes, { where: { id } });
}

module.exports = {
  genJSONApiResByRecord,
  genJSONApiResByRecords,
  updateResource,
  checkIfExist
};
