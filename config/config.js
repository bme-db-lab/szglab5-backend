const _ = require('lodash');
const { readFileSync } = require('fs');
const path = require('path');

const env = process.env.NODE_ENV;
if (!env) {
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
    port: 7000
  },
  frontend: {
    port: 4200
  },
  jwt: {
    secret: 'SuperSecret_Tuturu_Pumpuru'
  },
  bcrypt: {
    saltRounds: 10
  },
  env
};
let specConfig = {};
try {
  const specConfigPath = path.join(__dirname, `./config.${env}.json`);
  const specConfigFile = readFileSync(specConfigPath);
  specConfig = JSON.parse(specConfigFile.toString());
  console.log(`Config file(${path.basename(specConfigPath)}) loaded`);
} catch (err) {
  console.log(`Error during specific config file: ${err}`);
  console.log('Fallback to default config!');
}

const config = _.merge(defaultConfig, specConfig);

module.exports = config;
