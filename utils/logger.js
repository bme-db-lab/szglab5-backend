const winston = require('winston');

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
      name: 'debug-file',
      filename: 'debug.log',
      level: 'debug'
    }),
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'warn-file',
      filename: 'warn.log',
      level: 'warn'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'error.log',
      level: 'error'
    }),
    new (winston.transports.File)({
      name: 'fatal-file',
      filename: 'fatal.log',
      level: 'fatal'
    }),
    new (winston.transports.Console)()
  ]
});

module.exports = logger;