const winston = require('winston');
const config = require('../config/config.js');
require('winston-daily-rotate-file');

const logger = new (winston.Logger)({
  levels: {
    debug: 7,
    info: 6,
    warn: 4,
    error: 3,
    fatal: 2,
  },
  transports: [
    new winston.transports.DailyRotateFile({
      name: 'debugFile',
      filename: config.logger.path + 'debug.log',
      level: 'debug'
    }),
    new winston.transports.DailyRotateFile({
      name: 'infoFile',
      filename: config.logger.path + 'info.log',
      level: 'info',
    }),
    new winston.transports.DailyRotateFile({
      name: 'warnFile',
      filename: config.logger.path + 'warn.log',
      level: 'warn'
    }),
    new winston.transports.DailyRotateFile({
      name: 'errorFile',
      filename: config.logger.path + 'error.log',
      level: 'error'
    }),
    new winston.transports.DailyRotateFile({
      name: 'fatalFile',
      filename: config.logger.path + 'fatal.log',
      level: 'fatal'
    })
  ]
});

if (logger.levels[config.logger.fileLevel]) {
  for (var transport in logger.transports) {
    logger.transports[transport].silent = logger.levels[logger.transports[transport].level] > logger.levels[config.logger.fileLevel];
    logger.transports[transport].datePattern = config.logger.rotatePattern;
    logger.transports[transport].maxsize = config.logger.rotateSize;
  }
} else
  logger.error('Invalid file logging level.');

if (logger.levels[config.logger.consoleLevel])
  logger.add(winston.transports.Console, { level: config.logger.consoleLevel });
else {
  logger.add(winston.transports.Console, { level: 'info' });
  logger.error('Invalid console logging level.');
}

module.exports = logger;