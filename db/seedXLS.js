const async = require('async');
const bcrypt = require('bcrypt');
const config = require('../config/config.js');
const parseStudents = require('./xlsxParser/StudentParser.js');
const parseStaff = require('./xlsxParser/StaffParser.js');
const parseExercises = require('./xlsxParser/ExerciseParser.js');

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

module.exports = (db) => {
  return new Promise((resolve, reject) => {
    parseStudents()
      .then(students => seedDB(db, 'Users', students))
      .then(() => parseStaff())
      .then(staff => seedDB(db, 'Users', staff))
      .then(() => parseExercises())
      .then(exercises => seedDB(db, 'ExerciseTypes', exercises))
      .then(() => { resolve(null); })
      .catch((err) => { reject(err); });
  });
};
