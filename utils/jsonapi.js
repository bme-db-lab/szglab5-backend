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
        const data = record.dataValues;
        const pureAttributes = JSON.parse(JSON.stringify(data));
        if (pureAttributes.id) {
          delete pureAttributes.id;
        }
        if (pureAttributes.createdAt) {
          delete pureAttributes.createdAt;
        }
        if (pureAttributes.updatedAt) {
          delete pureAttributes.updatedAt;
        }
        resolve({
          data: {
            id: data.id,
            type: modelName,
            attributes: pureAttributes
          },
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
