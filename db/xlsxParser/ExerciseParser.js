const async = require('async');
const logger = require('../../utils/logger.js');
const XLSX = require('xlsx');

module.exports = () => {
  return new Promise((resolve, reject) => {
    let seed = null;
    try {
      const seedFile = 'db/seedData/beosztas-minta.xlsx';
      const sheetName = 'Feladatok es kodjaik';
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
      const exercises = [];
      let exercise = { data: {} };
      async.eachSeries(Object.keys(seed),
      (key, callback) => {
        if (key[1] !== '1') {
          switch (key[0]) {
            case 'A':
              exercise = { data: {} };
              if (seed[key].w !== undefined) {
                exercise.data.exId = seed[key].w;
              } else {
                exercise.data.exId = null;
              }
              break;
            case 'B':
              if (seed[key].w !== undefined) {
                exercise.data.name = seed[key].w;
              } else {
                exercise.data.name = null;
              }
              break;
            case 'C':
              if (seed[key].w !== undefined) {
                exercise.data.shortName = seed[key].w;
              } else {
                exercise.data.shortName = null;
              }
              if (Object.keys(exercise).length !== 0) {
                exercises.push(exercise);
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
        return resolve(exercises);
      }
    );
    } else {
      logger.warn('No seed data provided');
      resolve();
    }
  });
};
