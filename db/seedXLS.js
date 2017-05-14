const async = require('async');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const config = require('../config/config.js');
const parseStudents = require('./xlsxParser/StudentParser.js');
const parseStaff = require('./xlsxParser/StaffParser.js');
const parseExercises = require('./xlsxParser/ExerciseParser.js');
const parseTimetable = require('./xlsxParser/TimetableParser.js');
const parseGroups = require('./xlsxParser/StudentGroupParser.js');
const logger = require('../utils/logger.js');

function seedDB(db, modelName, data) {
  return new Promise((resolve, reject) => {
    async.eachSeries(data,
      (modelInstance, callback) => {
        const obj = modelInstance.data;
        const includes = modelInstance.include;
        let includeModels = [];
        if (includes !== undefined) {
          includeModels = includes.map(include => db[include]);
        }
        if (modelName === 'Users') {
          const passwordHash = bcrypt.hashSync(obj.password, config.bcrypt.saltRounds);
          obj.password = passwordHash;
        }
        db[modelName].create(obj, { include: includeModels })
        .then(() => {
          callback(null);
        })
        .catch((err) => {
          callback(err);
        });
      },
    (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(db);
    });
  });
}

function initBase(db) {
  return new Promise((resolve, reject) => {
    const seedDataPath = process.argv[3] ? process.argv[3] : './dev.initbase.json';
    let seed = null;
    try {
      const seedFile = fs.readFileSync(path.join(__dirname, './seedData', seedDataPath));
      seed = JSON.parse(seedFile.toString());
    } catch (err) {
      reject(err);
      return;
    }

    if (seed !== null) {
      async.eachSeries(Object.keys(seed),
      (modelName, callback) => {
        if (!(modelName in db)) {
          callback(new Error(`DB has no model with name: "${modelName}"`));
          return;
        }
        const model = seed[modelName];
        seedDB(db, modelName, model)
          .then(() => { callback(null); })
          .catch((err) => { callback(err); });
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(err);
      }
    );
    } else {
      logger.warn('No seed data provided');
      resolve();
    }
  });
}

module.exports = (db) => {
  return new Promise((resolve, reject) => {
    const students = parseStudents();
    const staff = parseStaff();
    const exercises = parseExercises();
    const timetable = parseTimetable();
    const groups = parseGroups();

    initBase(db)
      .then(() => seedDB(db, 'Users', students.users))
      .then(() => seedDB(db, 'ExerciseTypes', exercises))
      .then(() => seedDB(db, 'Users', staff))
      .then(() => seedDB(db, 'StudentGroups', groups))
      .then(() => seedDB(db, 'StudentRegistrations', students.regs))
      .then(() => seedDB(db, 'Appointments', timetable))
      .then(() => { resolve(null); })
      .catch((err) => { reject(err); });
  });
};
