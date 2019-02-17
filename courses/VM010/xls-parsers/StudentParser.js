const logger = require('../../../utils/logger.js');
const XLSX = require('xlsx');
const { getDB } = require('../../../db/db.js');
const generator = require('generate-password');
const { join } = require('path');

module.exports = async (semesterId, options) => {
  const db = getDB();
  let seed = null;
  try {
    const xlsFileName = options.xlsHallgatokFileName || 'hallgatok-minta.xlsx';
    const basePath = options.basePath || 'courses/VM007/xls-data';

    const seedFilePath = join(basePath, xlsFileName);
    const sheetName = 'Hallgatoi csoportbeosztas';
    const opts = {
      sheetStubs: true,
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
    const users = [];
    let user = { data: {} };
    for (const key of Object.keys(seed)) {
      const reg = /([A-Z]+)([0-9]+)/;
      const rKey = reg.exec(key);
      if (rKey !== null) {
        if (rKey[2] !== '1') {
          switch (key[0]) {
            case 'A': {
              user = { data: {} };
              users.push(user);
              let initPassword = '12345';
              if (options.genPass) {
                initPassword = generator.generate({
                  length: 10,
                  numbers: true,
                  excludeSimilarCharacters: true
                });
              }
              user.data.initPassword = initPassword;
              user.data.password = initPassword;
            }
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
                user.data.loginName = seed[key].w;
              } else {
                user.data.neptun = null;
              }
              break;
            case 'D':
              /* if (seed[key].w !== undefined) {
                user.data.loginName = seed[key].w;
              } else if (user.data.neptun) {
                user.data.loginName = user.data.neptun;
              } else {
                user.data.loginName = null;
              } */
              break;
            case 'E':
              // let initPassword = '12345';
              // if (seed[key].w !== undefined) {
              //   user.data.password = seed[key].w;
              // } else {
              //   if (options.genPass) {
              //     initPassword = generator.generate({
              //       length: 10,
              //       numbers: true
              //     });
              //   }
              //   user.data.initPassword = initPassword;
              //   user.data.password = initPassword;
              // }
              break;
            case 'G':
              if (user.data.neptun !== null) {
                user.data.university = 'BME';
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
