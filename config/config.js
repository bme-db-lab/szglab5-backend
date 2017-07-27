const _ = require('lodash');
const { readFileSync } = require('fs');
const path = require('path');
const argv = require('yargs').argv;

const env = process.env.NODE_ENV || argv.env;
if (!env ) {
  throw new Error('Please specify the NODE_ENV environment variable!');
}

const defaultConfig = {
  db: {
    dialect: 'postgres',
    host: 'localhost',
    port: '5432',
    database: 'laboradmin',
    username: 'postgres',
    password: 'devpass'
  },
  api: {
    port: 7000,
    monitoringPort: 9000
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

module.exports = config;
