const { getAssociatedObjects } = require('./utils.js');

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
  genJSONApiResByRecord
};
