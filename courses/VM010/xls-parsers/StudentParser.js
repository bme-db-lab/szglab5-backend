const logger = require('../../../utils/logger.js');
const XLSX = require('xlsx');
const { getDB } = require('../../../db/db.js');

module.exports = async (semesterId, devInit) => {
  const db = getDB();
  let seed = null;
  try {
    const seedFilePath = 'courses/VM010/xls-data/hallgatok-minta.xlsx';
    const sheetName = 'Hallgatoi csoportbeosztas másol';
    const opts = {
      sheetStubs: true,
    };

    if (devInit) {
      opts.sheetRows = 10;
    }

    const workbook = XLSX.readFile(seedFilePath, opts);
    seed = workbook.Sheets[sheetName];
  } catch (err) {
    throw err;
  }

  if (seed !== null) {
    const users = [];
    let user = { data: {} };
    for (const key of Object.keys(seed)) {
      const reg = /([A-Z]+)([0-9]+)/;
      const rKey = reg.exec(key);
      if (rKey !== null) {
        if (rKey[2] !== '1') {
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
              } else if (user.data.neptun) {
                user.data.loginName = user.data.neptun;
              } else {
                user.data.loginName = null;
              }
              break;
            case 'E':
              if (seed[key].w !== undefined) {
                user.data.password = seed[key].w;
              } else {
                user.data.password = '12345';
              }
              break;
            case 'G':
              if (user.data.neptun !== null) {
                user.data.university = 'BME';
                users.push(user);
              }
              break;
            default:
          }
        }
      }
    }
    return users;
  }
  logger.warn('No seed data provided');
  return null;
};
