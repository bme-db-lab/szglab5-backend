const XLSX = require('xlsx');
const { getDB } = require('../../../db/db.js');

const generator = require('generate-password');

module.exports = async (options) => {
  const db = getDB();
  let seed = null;
  try {
    const xlsFileName = options.xlsBeosztasFileName || 'beosztas-minta';

    const seedFile = `courses/VM010/xls-data/${xlsFileName}.xlsx`;
    const sheetName = 'Nevek, elerhetosegek';
    const opts = {
      sheetStubs: true,
    };
    const workbook = XLSX.readFile(seedFile, opts);
    seed = workbook.Sheets[sheetName];
  } catch (err) {
    return err;
  }

  const users = {};
  const exList = [];
  let conn = { data: {} };
  let user = { data: {} };
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
              user.data.loginName = seed[key].w;
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
            if (user.data.email_official !== null) {
              user.data.university = 'BME';
              let initPassword = '12345';
              if (options.genPass) {
                initPassword = generator.generate({
                  length: 10,
                  numbers: true
                });
              }
              user.data.initPassword = initPassword;
              user.data.password = initPassword;
              users[user.data.email_official] = user;
            } else {
              return true;
            }
            break;
          default:
        }
      }
      return false;
    });

  seed = null;
  try {
    const seedFile = 'courses/VM010/xls-data/beosztas-minta.xlsx';
    const sheetName = 'Laborvezetok';
    const opts = {};
    opts.sheetStubs = true;
    const workbook = XLSX.readFile(seedFile, opts);
    seed = workbook.Sheets[sheetName];
  } catch (err) {
    return err;
  }
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
          if (seed[key].w !== undefined) {
            user.data.email_official = seed[key].w;
          } else {
            user.data.email_official = null;
          }
          break;
        case 'B':
          if (user.data.email_official != null) {
            if (seed[key].w !== undefined) {
              users[user.data.email_official].data.studentgroup_id = seed[key].w;
            } else {
              users[user.data.email_official].data.studentgroup_id = null;
            }
          }
          break;
        case 'C':
          if (user.data.email_official != null) {
            if (seed[key].w !== undefined) {
              users[user.data.email_official].data.classroom = seed[key].w;
            } else {
              users[user.data.email_official].data.classroom = null;
            }
          }
          break;
        case 'D':
          if (user.data.email_official != null) {
            if (seed[key].w !== undefined) {
              users[user.data.email_official].data.spec = seed[key].w;
            } else {
              users[user.data.email_official].data.spec = null;
            }
          }
          break;
        case 'E':
          if (user.data.email_official != null) {
            if (seed[key].w !== undefined) {
              users[user.data.email_official].data.printSupport = seed[key].w;
            } else {
              users[user.data.email_official].data.printSupport = null;
            }
          } else {
            return true;
          }
          break;
        case 'I':
          break;
        default:
      }
    }
    return false;
  });

  seed = null;
  try {
    const seedFile = 'courses/VM010/xls-data/beosztas-minta.xlsx';
    const sheetName = 'Guruk, javitok';
    const opts = {};
    opts.sheetStubs = true;
    const workbook = XLSX.readFile(seedFile, opts);
    seed = workbook.Sheets[sheetName];
  } catch (err) {
    return err;
  }
  Object.keys(seed).some(
    (key) => {
      const reg = /([A-Z]+)([0-9]+)/;
      const rKey = reg.exec(key);
      if (rKey === null) {
        return false;
      }
      if (rKey[2] !== '1' && rKey[2] !== '2') {
        switch (key[0]) {
          case 'A':
            user = { data: {} };
            conn = { data: {} };
            if (seed[key].w !== undefined) {
              conn.data.guru = seed[key].w;
              user.data.email_official = seed[key].w;
            } else {
              user.data.email_official = null;
            }
            break;
          case 'B':
            if (user.data.email_official != null) {
              if (seed[key].w !== undefined) {
                conn.data.ex = seed[key].w;
                users[user.data.email_official].data.OwnedExerciseId = seed[key].w;
              }
            }
            break;
          case 'D':
            user = { data: {} };
            if (seed[key].w !== undefined) {
              user.data.email_official = seed[key].w;
              if (conn.data.guru === undefined || conn.data.guru === null) {
                conn.data.guru = seed[key].w;
              }
            } else {
              user.data.email_official = null;
            }
            break;
          case 'E':
            if (user.data.email_official != null) {
              if (seed[key].w !== undefined) {
                conn.data.exercises = seed[key].w;
              } else {
                conn.data.exercises = seed[key].w;
              }
            }
            break;
          case 'F':
            if (seed[key].w !== undefined && user.data.email_official != null) {
              if (conn.data.exercises !== undefined && conn.data.exercises !== null && conn.data.exercises !== '') {
                conn.data.exercises += `,${seed[key].w}`;
              } else {
                conn.data.exercises = seed[key].w;
              }
            }
            exList.push(conn);
            if (user.data.email_official == null) {
              return true;
            }
            break;
          case 'J':
            break;
          default:
        }
      }
      return false;
    });
  const simpleUsers = [];
  Object.keys(users).some(
    (key) => {
      simpleUsers.push(users[key]);
      return false;
    });
  return { simpleUsers, exList };
};
