const XLSX = require('xlsx');
const generator = require('generate-password');
const { join } = require('path');

const { getDB } = require('../../../db/db.js');


module.exports = async (options) => {
  const db = getDB();
  let seed = null;
  try {
    const xlsFileName = options.xlsBeosztasFileName || 'beosztas-minta.xlsx';
    const basePath = options.basePath || 'courses/VM007/xls-data';

    const seedFile = join(basePath, xlsFileName);
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
              user.data.email_official = seed[key].w.trim();
              users[user.data.email_official] = user;
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
                  numbers: true,
                  excludeSimilarCharacters: true
                });
              }
              // password will be hased before loading into the DB in db/seed.js
              user.data.password = initPassword;
            } else {
              return true;
            }
            break;
          case 'F':
            if (seed[key].w !== undefined) {
              user.data.neptun = seed[key].w;
            }
            break;
          default:
        }
      }
      return false;
    });

  seed = null;
  try {
    const xlsFileName = options.xlsBeosztasFileName || 'beosztas-minta.xlsx';
    const basePath = options.basePath || 'courses/VM007/xls-data';

    const seedFile = join(basePath, xlsFileName);
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
            user.data.email_official = seed[key].w.trim();
          } else {
            user.data.email_official = null;
          }
          break;
        case 'B':
        console.log(user.data);
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

  let gurukJavitok = null;
  try {
    const xlsFileName = options.xlsBeosztasFileName || 'beosztas-minta.xlsx';
    const basePath = options.basePath || 'courses/VM007/xls-data';

    const seedFile = join(basePath, xlsFileName);
    const sheetName = 'Guruk, javitok';
    const opts = {};
    opts.sheetStubs = true;
    const workbook = XLSX.readFile(seedFile, opts);
    gurukJavitok = workbook.Sheets[sheetName];
  } catch (err) {
    return err;
  }
  const keysWeNeed = Object.keys(gurukJavitok).filter(key => key.match(/([A-Z]+)([0-9]+)/));

  let guru = { data: {} };
  let corrector = { data: {} };

  keysWeNeed.forEach((key) => {
    // skip header
    if ((key[1] === '1' || key[1] === '2') && key.length === 2) {
      return;
    }
    switch (key[0]) {
      case 'A':
        guru = { data: {} };
        if (gurukJavitok[key].w) {
          const trimedEmail = gurukJavitok[key].w.trim();
          const guruItemExist = exList.find(guruItem => guruItem.data.guru === trimedEmail);

          if (guruItemExist) {
            guru.data.guru = null;
            guruItemExist.data.ex.push(gurukJavitok[`B${key.substr(1)}`].w);
          } else {
            guru.data.guru = gurukJavitok[key].w.trim();
          }
        } else {
          guru.data.guru = null;
        }
        break;
      case 'B':
        if (guru.data.guru != null && gurukJavitok[key].w) {
          guru.data.ex = [gurukJavitok[key].w];
          guru.data.exercises = gurukJavitok[key].w;
          users[guru.data.guru].data.OwnedExerciseId = gurukJavitok[key].w;
          exList.push(guru);
        }
        break;
      case 'D': {
        corrector = { data: {} };
        if (gurukJavitok[key].w) {
          const trimedEmail = gurukJavitok[key].w.trim();
          const correctorItemExist = exList.find(guruItem => guruItem.data.guru === trimedEmail);

          if (correctorItemExist) {
            corrector.data.guru = null;
            correctorItemExist.data.exercises = gurukJavitok[`E${key.substr(1)}`].w;
          } else {
            corrector.data.guru = trimedEmail;
          }
        } else {
          corrector.data.guru = null;
        }
        break;
      }
      case 'E':
        if (corrector.data.guru && gurukJavitok[key].w) {
          corrector.data.exercises = gurukJavitok[key].w;
          corrector.data.ex = [];
          exList.push(corrector);
        }
        break;
      default:
        break;
    }
  });

  // Object.keys(seed).some(
  //   (key) => {
  //     const reg = /([A-Z]+)([0-9]+)/;
  //     const rKey = reg.exec(key);
  //     if (rKey === null) {
  //       return false;
  //     }
  //     if (rKey[2] !== '1' && rKey[2] !== '2') {
  //       switch (key[0]) {
  //         case 'A':
  //           user = { data: {} };
  //           conn = { data: {} };
  //           if (seed[key].w !== undefined) {
  //             conn.data.guru = seed[key].w;
  //             user.data.email_official = seed[key].w;
  //           } else {
  //             user.data.email_official = null;
  //           }
  //           break;
  //         case 'B':
  //           if (user.data.email_official != null) {
  //             if (seed[key].w !== undefined) {
  //               conn.data.ex = seed[key].w;
  //               users[user.data.email_official].data.OwnedExerciseId = seed[key].w;
  //             }
  //           }
  //           break;
  //         case 'D':
  //           user = { data: {} };
  //           if (seed[key].w !== undefined) {
  //             user.data.email_official = seed[key].w;
  //             if (conn.data.guru === undefined || conn.data.guru === null) {
  //               conn.data.guru = seed[key].w;
  //             }
  //           } else {
  //             user.data.email_official = null;
  //           }
  //           break;
  //         case 'E':
  //           if (user.data.email_official != null) {
  //             if (seed[key].w !== undefined) {
  //               conn.data.exercises = seed[key].w;
  //             } else {
  //               conn.data.exercises = seed[key].w;
  //             }
  //           }
  //           break;
  //         case 'F':
  //           if (seed[key].w !== undefined && user.data.email_official != null) {
  //             if (conn.data.exercises !== undefined && conn.data.exercises !== null && conn.data.exercises !== '') {
  //               conn.data.exercises += `,${seed[key].w}`;
  //             } else {
  //               conn.data.exercises = seed[key].w;
  //             }
  //           }
  //           exList.push(conn);
  //           if (user.data.email_official == null) {
  //             return true;
  //           }
  //           break;
  //         case 'J':
  //           break;
  //         default:
  //       }
  //     }
  //     return false;
  //   });

  const simpleUsers = Object.keys(users).map(usersKey => users[usersKey]);


  // Object.keys(users).some(
  //   (key) => {
  //     simpleUsers.push(users[key]);
  //     return false;
  //   });

  return { simpleUsers, exList };
};
