const logger = require('../../utils/logger.js');
const XLSX = require('xlsx');

module.exports = () => {
  let seed = null;
  try {
    const seedFile = 'db/seedData/beosztas-minta.xlsx';
    const sheetName = 'Feladatok es kodjaik';
    const opts = {
      sheetStubs: true,
    };
    const workbook = XLSX.readFile(seedFile, opts);
    seed = workbook.Sheets[sheetName];
  } catch (err) {
    return err;
  }

  if (seed !== null) {
    const exercises = [];
    let exercise = { data: {} };
    Object.keys(seed).some(
    (key) => {
      const reg = /([A-Z]+)([0-9]+)/;
      const rKey = reg.exec(key);
      if (rKey === null) {
        return false;
      }
      if (rKey[2] !== '1') {
        switch (key[0]) {
          case 'A':
            exercise = { data: {} };
            if (seed[key].w !== undefined) {
              exercise.data.id = seed[key].w;
            } else {
              exercise.data.id = null;
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
            if (exercise.data.id != null) {
              if (exercise.data.language === undefined) {
                exercise.data.language = 'magyar';
              }
              exercises.push(exercise);
            } else {
              return true;
            }
            break;
          default:
        }
      }
      return false;
    });
    return exercises;
  }
  logger.warn('No seed data provided');
  return null;
};
