const logger = require('../../../utils/logger.js');
const XLSX = require('xlsx');
const { getDB } = require('../../../db/db.js');
const { join } = require('path');

module.exports = async (semesterId, options) => {
  const db = getDB();
  let seed = null;

  let currentExTypeHun = 0;
  let currentExTypeEng = 0;
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
              
              // random exercise type distribution
              const engStudent = sreg.data.neptunCourseCode.includes('-a');

              const qCourse = await db.Semesters.findOne({ where: { id: semesterId } });
              if (engStudent) {
                // English student
                const qExEng = await db.ExerciseTypes.findAll({ where: {
                  CourseId: qCourse.dataValues.id,
                  exerciseId: {
                    $gte: 52
                  }
                } });
                if (currentExTypeEng < qExEng.length - 1) {
                  currentExTypeEng++;
                } else {
                  currentExTypeEng = 0;
                }
                const record = qExEng[currentExTypeEng];
                sreg.data.ExerciseTypeId = record.dataValues.id;
              } else {
                // Hungarian student
                const qExHun = await db.ExerciseTypes.findAll({ where: {
                  CourseId: qCourse.dataValues.id,
                  exerciseId: {
                    $lte: 34
                  }
                } });
                if (currentExTypeHun < qExHun.length - 1) {
                  currentExTypeHun++;
                } else {
                  currentExTypeHun = 0;
                }
                const record = qExHun[currentExTypeHun];
                sreg.data.ExerciseTypeId = record.dataValues.id;
              }
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
