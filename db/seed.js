const async = require('async');

const config = require('../config/config.js');
// -----------------QuestionTypes
const questionTypes = [
  {
    name: 'Oracle'
  },
  {
    name: 'SQL'
  },
  {
    name: 'DBM'
  }
];

function createQuestionTypes(db) {
  return new Promise((resolve, reject) => {
    async.eachSeries(questionTypes,
      (questionType, callback) => {
        db.QuestionType.create({
          name: questionType.name
        })
        .then(() => callback(null))
        .catch((err) => callback(err));
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(db);
      }
    );
  });
}
// -----------------Tests
const tests =  [
  {
    title: 'szuper teszt'
  },
  {
    title: 'teszt adas'
  }
];

function createTests(db) {
  return new Promise((resolve, reject) => {
    async.eachSeries(tests,
      (test, callback) => {
        db.Test.create({
          title: test.name
        })
        .then(() => callback(null))
        .catch((err) => callback(err));
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(db);
      }
    );
  });
}
// -----------------Test Questions
const testQuestions =  [
  {
    text: 'Question 1',
    TestId: 1,
    QuestionTypeId: 1
  },
  {
    text: 'Question 2',
    TestId: 1,
    QuestionTypeId: 2
  }
];

function createTestQuestions(db) {
  return new Promise((resolve, reject) => {
    async.eachSeries(testQuestions,
      (testQuestion, callback) => {
        db.TestQuestion.create({
          text: testQuestion.text,
          TestId: testQuestion.TestId,
          QuestionTypeId: testQuestion.QuestionTypeId
        })
        .then(() => callback(null))
        .catch((err) => callback(err));
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(db);
      }
    );
  });
}

module.exports = (db) => {
  return new Promise((resolve, reject) => {
    switch (config.env) {
      case 'dev':
        createQuestionTypes(db)
        .then(createTests)
        .then(createTestQuestions)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
        break;
      default:
        createQuestionTypes(db)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};
