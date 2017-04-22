const winston = require('winston');
const config = require('../config/config.js');

const logger = new (winston.Logger)({
  levels: {
    debug: 7,
    info: 6,
    warn: 4,
    error: 3,
    fatal: 2,
  },
  transports: [
    new (winston.transports.File)({
      name: 'debugFile',
      filename: 'debug.log',
      level: 'debug'
    }),
    new (winston.transports.File)({
      name: 'infoFile',
      filename: 'info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'warnFile',
      filename: 'warn.log',
      level: 'warn'
    }),
    new (winston.transports.File)({
      name: 'errorFile',
      filename: 'error.log',
      level: 'error'
    }),
    new (winston.transports.File)({
      name: 'fatalFile',
      filename: 'fatal.log',
      level: 'fatal'
    })
  ]
});

if (logger.levels[config.logger.fileLevel]) {
  for (var transport in logger.transports)
    logger.transports[transport].silent = logger.levels[logger.transports[transport].level] > logger.levels[config.logger.fileLevel];
} else
  logger.error('Invalid file logging level.');

if (logger.levels[config.logger.consoleLevel])
  logger.add(winston.transports.Console, { level: config.logger.consoleLevel });
else {
  logger.add(winston.transports.Console, { level: 'info' });
  logger.error('Invalid console logging level.');
}

module.exports = logger;