const async = require('async');
const logger = require('../../utils/logger.js');
const XLSX = require('xlsx');

module.exports = () => {
  return new Promise((resolve, reject) => {
    let seed = null;
    try {
      const seedFile = 'db/seedData/hallgatok-minta.xlsx';
      const sheetName = 'Hallgatoi csoportbeosztas másol';
      const opts = {};
      opts.sheetRows = 5;
      opts.sheetStubs = true;
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
              if (seed[key].w !== undefined) {
                user.data.displayName = seed[key].w;
              } else {
                user.data.displayName = null;
              }
              break;
            case 'C':
              if (seed[key].w !== undefined) {
                user.data.neptun = seed[key].w;
              } else {
                user.data.neptun = null;
              }
              break;
            case 'D':
              if (seed[key].w !== undefined) {
                user.data.loginName = seed[key].w;
              } else {
                user.data.loginName = null;
              }
              break;
            case 'E':
              if (seed[key].w !== undefined) {
                user.data.password = seed[key].w;
              } else {
                user.data.password = 'defaultpass';
              }
              break;
            case 'G':
              if (Object.keys(user).length !== 0) {
                users.push(user);
              }
              break;
            default:
          }
        }
        callback(null);
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(users);
      }
    );
    } else {
      logger.warn('No seed data provided');
      resolve();
    }
  });
};
