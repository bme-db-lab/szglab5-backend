const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'error.log',
      level: 'error'
    }),
    new (winston.transports.Console)()
  ]
});

module.exports = logger;