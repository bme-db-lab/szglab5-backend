const logger = require('../../../utils/logger.js');
const XLSX = require('xlsx');
const { getDB } = require('../../../db/db.js');
const { join } = require('path');

module.exports = async (semesterId, options) => {
  const db = getDB();
  let seed = null;
  try {
    const xlsFileName = options.xlsHallgatokFileName || 'hallgatok-minta.xlsx';

    const basePath = options.basePath || 'courses/VM010/xls-data';

    const seedFilePath = join(basePath, xlsFileName);
    const sheetName = 'Hallgatoi csoportbeosztas';
    const opts = {
      sheetStubs: true
    };

    if (!options.allUser) {
      opts.sheetRows = 10;
    }

    const workbook = XLSX.readFile(seedFilePath, opts);
    seed = workbook.Sheets[sheetName];
  } catch (err) {
    throw err;
  }

  if (seed !== null) {
    const regs = [];
    let sreg = { data: {} };
    // for fair exercise distributon
    const qCourse = await db.Semesters.findOne({ where: { id: semesterId } });
    const qEx = await db.ExerciseTypes.findAll({ where: { CourseId: qCourse.dataValues.id } });

    let currentExType = 1;
    const exTypesCount = qEx.length;

    for (const key of Object.keys(seed)) {
      const reg = /([A-Z]+)([0-9]+)/;
      const rKey = reg.exec(key);
      if (rKey !== null) {
        if (rKey[2] !== '1') {
          switch (key[0]) {
            case 'A':
              sreg = { data: {} };
              regs.push(sreg);
              if (seed[key].w !== undefined) {
                sreg.data.neptunCourseCode = seed[key].w;
                const gQueryResult = await db.StudentGroups.findOne({
                  attributes: ['id'],
                  where: {
                    name: seed[key].w
                  }
                });
                sreg.data.StudentGroupId = gQueryResult.dataValues.id;
              } else {
                sreg.data.neptunCourseCode = null;
              }
              sreg.data.neptunSubjectCode = 'DUMMY';
              sreg.data.SemesterId = semesterId;

              sreg.data.ExerciseTypeId = currentExType;
              currentExType = currentExType < exTypesCount ? currentExType + 1 : 1;
              break;
            case 'C':
              if (seed[key].w !== undefined) {
                const nQueryResult = await db.Users.findOne({
                  attributes: ['id'],
                  where: {
                    neptun: seed[key].w
                  }
                });
                sreg.data.UserId = nQueryResult.dataValues.id;
              } else {
                sreg.data.UserId = null;
              }
              break;
            case 'G':
              if (sreg.data.UserId !== null) {
                sreg.data.LanguageId = 1;
              }
              break;
            default:
          }
        }
      }
    }
    return regs;
  }
  logger.warn('No seed data provided');
  return null;
};
