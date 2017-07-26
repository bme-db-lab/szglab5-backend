const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const config = require('../config/config.js');
const logger = require('./../utils/logger');

// sequelize db instance
let db = null;
/**
 * Initialize db connection and create the object relation mapping with sequelize
 *
 * @param  {object} _options - options
 * @param {boolean} _options.force - force the models to the database, previous tables will be dropped
 */
async function initDB(_options) {
  try {
    logger.debug('Initializing DB');
    const defaultOptions = {
      force: false
    };
    const options = Object.assign({}, defaultOptions, _options);

    // get related configs
    const { host, port, database, username, password, dialect } = config.db;

    db = {};
    const sequelize = new Sequelize(database, username, password, {
      host,
      port,
      dialect,
      logging: (msg) => {
        logger.debug(msg);
      }
    });
    const modelsPath = path.join(__dirname, '../models');
    const files = fs.readdirSync(modelsPath);
    // get sequelize model files
    const modelFiles = files.filter(file => (file !== 'index.js') && (file.indexOf('.') !== 0) && (file[0] !== '_'));
    // import the model files to sequelize
    modelFiles.forEach((file) => {
      const model = sequelize.import(path.join(modelsPath, file));
      db[model.name] = model;
    });
    // set model associations
    Object.keys(db).forEach((modelName) => {
      try {
        if ('associate' in db[modelName]) {
          db[modelName].associate(db);
        }
      } catch (err) {
        // asocciation error
        throw err;
      }
    });
    // Syncronize sequlize with the database
    await sequelize.sync({
      force: options.force
    });
    db.sequelize = sequelize;
    return db;
  } catch (err) {
    logger.err('Error occured during intializing the database');
    logger.err(err);
    return null;
  }
}

function getDB() {
  return db;
}

async function closeDB() {
  if (db !== null && db.sequelize) {
    await db.sequelize.close();
  }
}

module.exports = {
  initDB,
  getDB,
  closeDB
};
