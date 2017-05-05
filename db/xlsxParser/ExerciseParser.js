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
            if (exercise.data.exId != null) {
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
