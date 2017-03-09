const async = require('async');

const config = require('../config/config.js');
let seed;
switch (config.env) {
  case 'dev':
    seed = require('./dev.seed.js');
    break;
  case 'test':
    seed = require('./test.seed.js');
    break;
  case 'prod':
    seed = require('./prod.seed.js');
    break;
  default:
    seed = null;
}

function seedDB(db, modelName, data) {
  return new Promise((resolve, reject) => {
    async.eachSeries(data,
      (modelInstance, callback) => {
        db[modelName].create(modelInstance)
        .then(() => callback(null))
        .catch((err) => callback(err));
    },
    (err) => {
      if (err) {
        return reject(err);
      }
      resolve(db);
    });
  });
}

module.exports = (db) => {
  return new Promise((resolve, reject) => {
    if (seed !== null) {
      async.eachSeries(Object.keys(seed),
      (modelName, callback) => {
        const model = seed[modelName];
        seedDB(db, modelName, model)
          .then(() => { callback(null); })
          .catch((err) => { callback(err); });
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve(err);
      }
    );
    } else {
      console.log('No seed data provided');
      resolve();
    }
  });
};
