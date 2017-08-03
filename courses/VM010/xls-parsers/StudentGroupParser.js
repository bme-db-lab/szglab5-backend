const logger = require('../../../utils/logger.js');
const XLSX = require('xlsx');

module.exports = () => {
  let seed = null;
  try {
    const seedFile = 'courses/VM010/xls-data/beosztas-minta.xlsx';
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
              group = { data: {} };
              if (seed[key].w !== undefined) {
                group.data.Demonstrator = seed[key].w;
              } else {
                group.data.Demonstrator = null;
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
    return groups;
  }
  logger.warn('No seed data provided');
  return null;
};
