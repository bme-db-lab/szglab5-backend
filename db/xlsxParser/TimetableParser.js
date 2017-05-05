const async = require('async');
const logger = require('../../utils/logger.js');
const XLSX = require('xlsx');

module.exports = () => {
  return new Promise((resolve, reject) => {
    let seed = null;
    try {
      const seedFile = 'db/seedData/beosztas-minta.xlsx';
      const sheetName = 'Idopontok';
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
      async.eachSeries(Object.keys(seed),
      (key, callback) => {
        console.log(key);
        callback(null);
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(null);
      }
    );
    } else {
      logger.warn('No seed data provided');
      resolve();
    }
  });
};
