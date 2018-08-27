const _ = require('lodash');
const { readFileSync } = require('fs');
const path = require('path');
const argv = require('yargs').argv;

const env = process.env.NODE_ENV || argv.env;
if (!env) {
  throw new Error('Please specify the NODE_ENV environment variable!');
}

const defaultConfig = {
  db: {
    dialect: 'postgres',
    host: process.env.LABORADMIN_DB_HOST || 'localhost',
    port: process.env.LABORADMIN_DB_PORT || '5432',
    database: process.env.LABORADMIN_DB_NAME || 'laboradmin',
    username: process.env.LABORADMIN_DB_USER || 'postgres',
    password: process.env.LABORADMIN_DB_PASSWORD || 'devpass'
  },
  api: {
    port: 7000
  },
  monitoring: {
    port: 9000,
    updateSec: 10
  },
  frontend: {
    port: 4200
  },
  jwt: {
    // MUST override in production environment!!
    secret: 'SuperSecret_Tuturu_Pumpuru'
  },
  bcrypt: {
    saltRounds: 10
  },
  logger: {
    consoleLevel: 'info',
    consoleLogEnabled: true,
    fileLevel: 'info',
    fileLogEnabled: true,
    filePath: './',
    rotatePattern: '.yyyy-MM-dd.bak',
    rotateSize: 1000000,
    logPostData: true
  },
  env,
  cors: {
    whitelist: ['http://localhost:4200']
  },
  mailer: {
    host: 'fecske-prod.db.bme.hu',
    port: 25,
    user: 'szglab5',
    pass: 'szglab5pass',
    forcetls: false,
    defaultSubject: 'Adatbazisok labor rendszeruzenet',
    defaultFromDisplayName: 'Adatbazisok labor adminisztracios rendszer'
  },
  git: {
    provider: 'gitlab',
    baseUrl: 'http://localhost:8020/api/v4',
    privateToken: 'XT5zTBwtW3NzNbQwrpyp'
  },
  uploadFile: {
    currentTargetStorageId: 0,
    // absolute, or relative to config
    storages: [
      {
        id: 0,
        rootPath: '../files'
      },
      {
        id: 1,
        rootPath: '../files'
      }
    ]
  },
  generatedFilesPath: path.join(__dirname, '../generated')
};

let specConfig = {};
try {
  const specConfigPath = path.join(__dirname, `./config.${env}.json`);
  const specConfigFile = readFileSync(specConfigPath);
  specConfig = JSON.parse(specConfigFile.toString());
  console.log(`Config file(${path.basename(specConfigPath)}) loaded`);
} catch (err) {
  console.log(`Can not read specific config file: ${err}`);
  console.log('Fallback to default config!');
}

const config = _.merge(defaultConfig, specConfig);
// set uploadFile paths
config.uploadFile.storages.forEach((storage) => {
  storage.resolvedRootPath = path.isAbsolute(storage.rootPath) ? storage.rootPath : path.join(__dirname, storage.rootPath);
});
const currentStorage = config.uploadFile.storages.find(storage => storage.id === config.uploadFile.currentTargetStorageId);
if (!currentStorage) {
  throw new Error(`No storage found for currentTargetStorageId: ${config.uploadFile.currentTargetStorageId}`);
}
config.uploadFile.currentStorage = currentStorage;

module.exports = config;
