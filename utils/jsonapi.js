const { getAssociatedObjects } = require('./utils.js');

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
    getAssociatedObjects(db, modelName, record)
      .then((relationships) => {
        const attributes = record.dataValues;
        resolve({
          data: attributes,
          relationships
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  genJSONApiResByRecord,
  checkIfExist
};
