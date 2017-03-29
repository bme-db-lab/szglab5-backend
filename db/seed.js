const async = require('async');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const config = require('../config/config.js');

function seedDB(db, modelName, data) {
  return new Promise((resolve, reject) => {
    async.eachSeries(data,
      (modelInstance, callback) => {
        const obj = modelInstance.data;
        const includes = modelInstance.include;
        let includeModels = [];
        if (includes !== undefined) {
          includeModels = includes.map(include => db[include]);
        }
        if (modelName === 'Users') {
          const passwordHash = bcrypt.hashSync(obj.password, config.bcrypt.saltRounds);
          obj.password = passwordHash;
        }
        db[modelName].create(obj, { include: includeModels })
        .then(() => {
          callback(null);
        })
        .catch((err) => {
          callback(err);
        });
      },
    (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(db);
    });
  });
}

module.exports = (db) => {
  return new Promise((resolve, reject) => {
    const seedDataPath = process.argv[3] ? process.argv[3] : './dev.seed.json';
    let seed = null;
    try {
      const seedFile = fs.readFileSync(path.join(__dirname, './seedData', seedDataPath));
      seed = JSON.parse(seedFile.toString());
    } catch (err) {
      reject(err);
      return;
    }

    if (seed !== null) {
      async.eachSeries(Object.keys(seed),
      (modelName, callback) => {
        if (!(modelName in db)) {
          callback(new Error(`DB has no model with name: "${modelName}"`));
          return;
        }
        const model = seed[modelName];
        seedDB(db, modelName, model)
          .then(() => { callback(null); })
          .catch((err) => { callback(err); });
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(err);
      }
    );
    } else {
      console.log('No seed data provided');
      resolve();
    }
  });
};
