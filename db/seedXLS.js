const async = require('async');
const bcrypt = require('bcrypt');
const config = require('../config/config.js');
const logger = require('../utils/logger.js');
const XLSX = require('xlsx');

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
    let seed = null;
    try {
      const seedFile = 'db/seedData/hallgatok-minta.xlsx';
      const sheetName = 'Hallgatoi csoportbeosztas másol';
      const opts = {};
      opts.sheetRows = 5;
      const workbook = XLSX.readFile(seedFile, opts);
      seed = workbook.Sheets[sheetName];
    } catch (err) {
      reject(err);
      return;
    }

    if (seed !== null) {
      const users = [];
      let user = { data: {} };
      async.eachSeries(Object.keys(seed),
      (key, callback) => {
        if (key[1] !== '1') {
          switch (key[0]) {
            case 'A':
              user = { data: {} };
              break;
            case 'B':
              user.data.displayName = seed[key].w;
              break;
            case 'C':
              user.data.neptun = seed[key].w;
              if (Object.keys(user).length !== 0) {
                user.data.password = 'defaultpass';
                users.push(user);
              }
              break;
            default:
          }
        }
        seedDB(db, 'Users', users)
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
      logger.warn('No seed data provided');
      resolve();
    }
  });
};
