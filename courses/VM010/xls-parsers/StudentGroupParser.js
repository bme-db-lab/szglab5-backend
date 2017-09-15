const logger = require('../../../utils/logger.js');
const XLSX = require('xlsx');
const { getDB } = require('../../../db/db.js');
const { join } = require('path');

module.exports = async (semesterId, options) => {
  const db = getDB();
  let seed = null;
  try {
    const xlsFileName = options.xlsBeosztasFileName || 'beosztas-minta';
    const basePath = options.basePath || 'courses/VM010/xls-data';

    const seedFile = join(basePath, `${xlsFileName}.xlsx`);
    const sheetName = 'Laborvezetok';
    const opts = {
      sheetStubs: true,
    };
    const workbook = XLSX.readFile(seedFile, opts);
    seed = workbook.Sheets[sheetName];
  } catch (err) {
    return err;
  }

  if (seed !== null) {
    const groups = [];
    const names = [];
    let group = { data: {} };
    for (const key of Object.keys(seed)) {
      const reg = /([A-Z]+)([0-9]+)/;
      const rKey = reg.exec(key);
      if (rKey !== null) {
        if (rKey[2] !== '1') {
          switch (key[0]) {
            case 'A':
              group = { data: {} };
              if (seed[key].w !== undefined) {
                const uQueryResult = await db.Users.findOne({
                  attributes: ['id'],
                  where: {
                    email_official: seed[key].w.trim()
                  }
                });
                group.data.UserId = uQueryResult.dataValues.id;
              } else {
                group.data.UserId = null;
              }
              break;
            case 'B':
              if (seed[key].w !== undefined) {
                group.data.name = seed[key].w;
              } else {
                group.data.name = null;
              }
              break;
            case 'D':
              if (seed[key].w === undefined) {
                group.data.language = 'magyar';
              } else {
                group.data.language = seed[key].w;
              }
              if (group.data.name !== null) {
                if (names.includes(group.data.name) === false) {
                  group.data.SemesterId = 1;
                  groups.push(group);
                  names.push(group.data.name);
                }
              }
              break;
            default:
          }
        }
      }
    }
    return groups;
  }
  logger.warn('No seed data provided');
  return null;
};
