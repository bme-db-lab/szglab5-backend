const logger = require('../../../utils/logger.js');
const XLSX = require('xlsx');
const { getDB } = require('../../../db/db.js');

module.exports = async (semesterId, options) => {
  const db = getDB();
  let seed = null;
  try {
    const xlsFileName = options.xlsBeosztasFileName || 'beosztas-minta';

    const seedFile = `courses/VM010/xls-data/${xlsFileName}.xlsx`;
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
    for (const key of Object.keys(seed)) {
      const reg = /([A-Z]+)([0-9]+)/;
      const rKey = reg.exec(key);
      if (rKey !== null) {
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
              if (exercise.data.name !== null) {
                if (exercise.data.language === undefined) {
                  exercise.data.LanguageId = 1;
                }
                const cQueryResult = await db.Semesters.findOne({
                  attributes: ['CourseId'],
                  where: {
                    id: semesterId
                  }
                });
                exercise.data.CourseId = cQueryResult.dataValues.CourseId;
                exercises.push(exercise);
              }
              break;
            default:
          }
        }
      }
    }
    return exercises;
  }
  logger.warn('No seed data provided');
  return null;
};
