const XLSX = require('xlsx');

module.exports = () => {
  let seed = null;
  try {
    const seedFile = 'courses/VM010/xls-data/beosztas-minta.xlsx';
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
            if (user.data.email_official != null) {
              user.data.university = 'BME';
              user.data.password = 'defaultpass';
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
          if (seed[key].w !== undefined) {
            user.data.email_official = seed[key].w;
          } else {
            user.data.email_official = null;
          }
          break;
        case 'B':
          if (user.data.email_official != null) {
            if (seed[key].w !== undefined) {
              users[user.data.email_official].data.OwnedExerciseId = seed[key].w;
            } else {
              users[user.data.email_official].data.OwnedExerciseId = null;
            }
          }
          break;
        case 'D':
          user = { data: {} };
          if (seed[key].w !== undefined) {
            user.data.email_official = seed[key].w;
          } else {
            user.data.email_official = null;
          }
          break;
        case 'E':
          if (user.data.email_official != null) {
            if (seed[key].w !== undefined) {
              users[user.data.email_official].data.exercises = seed[key].w;
            } else {
              users[user.data.email_official].data.exercises = '';
            }
          }
          break;
        case 'F':
          if (seed[key].w !== undefined && user.data.email_official != null) {
            users[user.data.email_official].data.exercises += seed[key].w;
          }
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
  return simpleUsers;
};
