const winston = require('winston');
const config = require('../config/config.js');
const path = require('path');
require('winston-daily-rotate-file');

const logger = new (winston.Logger)({
  levels: {
    verbose: 8,
    debug: 7,
    info: 6,
    warn: 4,
    error: 3,
    fatal: 2,
  },
  colors: {
    verbose: 'green',
    debug: 'blue',
    info: 'yellow',
    warning: 'orange',
    error: 'red',
    fatal: 'red'
  }
});

if (config.logger.fileLogEnabled) {
  logger.add(winston.transports.DailyRotateFile, {
    name: 'rotateLog',
    filename: path.join(config.logger.filePath, 'laboradmin.log'),
    datePattern: config.logger.rotatePattern,
    maxsize: config.logger.rotateSize,
    level: config.logger.fileLevel
  });
}

if (config.logger.consoleLogEnabled) {
  logger.add(winston.transports.Console, {
    level: config.logger.consoleLevel,
    colorize: true
  });
}


module.exports = logger;
