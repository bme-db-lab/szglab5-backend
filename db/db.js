const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const async = require('async');

const config = require('../config/config.js');

let db = null;
function initDB(_options) {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      force: false
    };

    const options = Object.assign({}, defaultOptions, _options);

    const { host, port, database, username, password, dialect } = config.db;

    db = {};
    const sequelize = new Sequelize(database, username, password, {
      host,
      port,
      dialect,
    });

    const modelsPath = path.join(__dirname, '../models');
    const files = fs.readdirSync(modelsPath);
    const modelFiles = files.filter((file) => {
      return ((file !== 'index.js') && (file.indexOf('.') !== 0));
    });

    modelFiles.forEach((file) => {
      const model = sequelize.import(path.join(modelsPath, file));
      db[model.name] = model;
    });
    // set assocations
    let associateErr = null;
    Object.keys(db).forEach((modelName) => {
      try {
        if ('associate' in db[modelName]) {
          db[modelName].associate(db);
        }
      } catch(err) {
        associateErr = err;
      }
    });
    if (associateErr !== null) {
      return reject(associateErr);
    }

    // sync models to the database
    async.eachSeries(Object.keys(db),
      (modelName, callback) => {
        console.log(`Syncing model ${modelName}...`);
        db[modelName].sync({
          force: options.force // force sync: drop the existing database
        })
          .then(() => {
            console.log(`Syncing model ${modelName} succeed!`);
            callback(null);
          })
          .catch((err) =>{
            // console.log(`Error during syncing model ${modelName}: ${err.message}`);
            callback(err);
          });
      },
      (err) => {
        if (err) {
          reject(err);
        }
        db.sequelize = sequelize;
        resolve(db);
      }
    );
  });
}

function getDB() {
  return db;
}

module.exports = {
  initDB,
  getDB
};
