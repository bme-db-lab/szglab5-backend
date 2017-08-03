const logger = require('../../../utils/logger.js');
const XLSX = require('xlsx');

module.exports = (semesterId) => {
  let seed = null;
  try {
    const seedFilePath = 'courses/VM010/xls-data/hallgatok-minta.xlsx';
    const sheetName = 'Hallgatoi csoportbeosztas másol';
    const opts = {
      sheetStubs: true,
      sheetRows: 10,
    };
    const workbook = XLSX.readFile(seedFilePath, opts);
    seed = workbook.Sheets[sheetName];
  } catch (err) {
    throw err;
  }

  if (seed !== null) {
    const users = [];
    const regs = [];
    let user = { data: {} };
    let sreg = { data: {} };
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
              user = { data: {} };
              sreg = { data: {} };
              if (seed[key].w !== undefined) {
                sreg.data.neptunCourseCode = seed[key].w;
                sreg.data.StudentGroupName = seed[key].w;
              } else {
                sreg.data.neptunCourseCode = null;
              }
              sreg.data.neptunSubjectCode = 'DUMMY';
              sreg.data.SemesterId = semesterId;
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
                sreg.data.UserId = seed[key].w;
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
              if (user.data.neptun != null) {
                user.data.university = 'BME';
                users.push(user);
                regs.push(sreg);
              } else {
                return true;
              }
              break;
            default:
          }
        }
        return false;
      }
  );
    return { users, regs };
  }
  logger.warn('No seed data provided');
  return null;
};
