const logger = require('../../utils/logger.js');
const XLSX = require('xlsx');

module.exports = () => {
  let seed = null;
  try {
    const seedFilePath = 'db/seedData/hallgatok-minta.xlsx';
    const sheetName = 'Hallgatoi csoportbeosztas másol';
    const opts = {
      sheetRows: 10,
      sheetStubs: true,
    };
    const workbook = XLSX.readFile(seedFilePath, opts);
    seed = workbook.Sheets[sheetName];
  } catch (err) {
    throw err;
  }

  if (seed !== null) {
    const users = [];
    let user = { data: {} };
    Object.keys(seed).some(
      (key) => {
        if (key[1] !== '1') {
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
                users.push(user);
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
    return users;
  }
  logger.warn('No seed data provided');
  return null;
};
