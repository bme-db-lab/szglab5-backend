const logger = require('../../utils/logger.js');
const XLSX = require('xlsx');

module.exports = () => {
  let seed = null;
  try {
    const seedFile = 'db/seedData/beosztas-minta.xlsx';
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
    let group = { data: {} };
    Object.keys(seed).some(
      (key) => {
        if (key[1] !== '1') {
          switch (key[0]) {
            case 'B':
              group = { data: {} };
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
                if (groups.indexOf(group.data) === -1) {
                  groups.push(group);
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
