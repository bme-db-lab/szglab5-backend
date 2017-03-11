const _ = require('lodash');

const env = process.env.NODE_ENV;
if (!env) {
  throw new Error('Please specify the NODE_ENV environment variable!');
}

// DB
const envDBHost = process.env.LAB_ADMIN_DB_HOST;
const envDBPort = process.env.LAB_ADMIN_DB_PORT;
const envDBName = process.env.LAB_ADMIN_DB_NAME;
const envDBUsername = process.env.LAB_ADMIN_DB_USER;
const envDBPassword = process.env.LAB_ADMIN_DB_PASSWORD;
// API
const envAPIPort = process.env.LAB_ADMIN_API_PORT;

// commonly used
let config = {
  db: {
    dialect: 'postgres'
  },
  env
};
switch (env) {
  case 'dev':
    _.merge(config, {
      db: {
        host: envDBHost !== undefined ? envDBHost : 'localhost',
        port: envDBPort !== undefined ? envDBPort : '5432',
        database: envDBName !== undefined ? envDBName : 'laboradmin',
        username: envDBUsername !== undefined ? envDBUsername : 'postgres',
        password: envDBPassword !== undefined ? envDBPassword : 'devpass'
      },
      api: {
        port: envAPIPort !== undefined ? envAPIPort : 7000
      }
    });
    break;
  case 'test':
    break;
  case 'prod':
    break;
  default:
    throw new Error(`Not supported NODE_ENV: "${env}"`);
}

module.exports = config;
