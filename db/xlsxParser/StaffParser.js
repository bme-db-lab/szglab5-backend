const async = require('async');
const logger = require('../../utils/logger.js');
const XLSX = require('xlsx');

module.exports = () => {
  return new Promise((resolve, reject) => {
    let seed = null;
    try {
      const seedFile = 'db/seedData/beosztas-minta.xlsx';
      const sheetName = 'Nevek, elerhetosegek';
      const opts = {};
      opts.sheetRows = 5;
      opts.sheetStubs = true;
      const workbook = XLSX.readFile(seedFile, opts);
      seed = workbook.Sheets[sheetName];
    } catch (err) {
      reject(err);
      return;
    }

    if (seed !== null) {
      const users = {};
      let user = { data: {} };
      async.eachSeries(Object.keys(seed),
      (key, callback) => {
        if (key[1] !== '1') {
          switch (key[0]) {
            case 'A':
              user = { data: {} };
              if (seed[key].w !== undefined) {
                user.data.displayName = seed[key].w;
              } else {
                user.data.displayName = null;
              }
              break;
            case 'B':
              if (seed[key].w !== undefined) {
                user.data.email = seed[key].w;
              } else {
                user.data.email = null;
              }
              break;
            case 'C':
              if (seed[key].w !== undefined) {
                user.data.email_official = seed[key].w;
              } else {
                user.data.email_official = null;
              }
              break;
            case 'D':
              if (seed[key].w !== undefined) {
                user.data.mobile = seed[key].w;
              } else {
                user.data.mobile = null;
              }
              break;
            case 'E':
              if (seed[key].w !== undefined) {
                user.data.title = seed[key].w;
              } else {
                user.data.title = null;
              }
              if (Object.keys(user).length !== 0) {
                user.data.password = 'defaultpass';
                users[user.data.displayName] = user;
              }
              break;
            default:
          }
        }
        callback(null);
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        return null;
      }
    );
      seed = null;
      try {
        const seedFile = 'db/seedData/beosztas-minta.xlsx';
        const sheetName = 'Laborvezetok';
        const opts = {};
        opts.sheetRows = 5;
        opts.sheetStubs = true;
        const workbook = XLSX.readFile(seedFile, opts);
        seed = workbook.Sheets[sheetName];
      } catch (err) {
        reject(err);
        return;
      }
      async.eachSeries(Object.keys(seed),
      (key, callback) => {
        if (key[1] !== '1') {
          switch (key[0]) {
            case 'A':
              user = { data: {} };
              if (seed[key].w !== undefined) {
                user.data.displayName = seed[key].w;
              } else {
                user.data.displayName = null;
              }
              break;
            case 'B':
              if (user.data.displayName != null) {
                if (seed[key].w !== undefined) {
                  users[user.data.displayName].data.studentgroup_id = seed[key].w;
                } else {
                  users[user.data.displayName].data.studentgroup_id = null;
                }
              }
              break;
            case 'C':
              if (user.data.displayName != null) {
                if (seed[key].w !== undefined) {
                  users[user.data.displayName].data.classroom = seed[key].w;
                } else {
                  users[user.data.displayName].data.classroom = null;
                }
              }
              break;
            case 'D':
              if (user.data.displayName != null) {
                if (seed[key].w !== undefined) {
                  users[user.data.displayName].data.spec = seed[key].w;
                } else {
                  users[user.data.displayName].data.spec = null;
                }
              }
              break;
            case 'E':
              if (user.data.displayName != null) {
                if (seed[key].w !== undefined) {
                  users[user.data.displayName].data.printSupport = seed[key].w;
                } else {
                  users[user.data.displayName].data.printSupport = null;
                }
              }
              break;
            case 'I':
              break;
            default:
          }
        }
        callback(null);
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        return null;
      }
  );
      seed = null;
      try {
        const seedFile = 'db/seedData/beosztas-minta.xlsx';
        const sheetName = 'Guruk, javitok';
        const opts = {};
        opts.sheetRows = 6;
        opts.sheetStubs = true;
        const workbook = XLSX.readFile(seedFile, opts);
        seed = workbook.Sheets[sheetName];
      } catch (err) {
        reject(err);
        return;
      }
      async.eachSeries(Object.keys(seed),
      (key, callback) => {
        if (key[1] !== '1' && key[1] !== '2') {
          switch (key[0]) {
            case 'A':
              user = { data: {} };
              if (seed[key].w !== undefined) {
                user.data.displayName = seed[key].w;
              } else {
                user.data.displayName = null;
              }
              break;
            case 'B':
              if (user.data.displayName != null) {
                if (seed[key].w !== undefined) {
                  users[user.data.displayName].data.ownedExerciseID = seed[key].w;
                } else {
                  users[user.data.displayName].data.ownedExerciseID = null;
                }
              }
              break;
            case 'D':
              user = { data: {} };
              if (seed[key].w !== undefined) {
                user.data.displayName = seed[key].w;
              } else {
                user.data.displayName = null;
              }
              break;
            case 'E':
              if (user.data.displayName != null) {
                if (seed[key].w !== undefined) {
                  users[user.data.displayName].data.exercises = seed[key].w;
                } else {
                  users[user.data.displayName].data.exercises = null;
                }
              }
              break;
            case 'F':
              if (seed[key].w !== undefined && user.data.displayName != null) {
                users[user.data.displayName].data.exercises += seed[key].w;
              }
              break;
            case 'J':
              break;
            default:
          }
        }
        callback(null);
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(users);
      }
    );
    } else {
      logger.warn('No seed data provided');
      resolve();
    }
  });
};
