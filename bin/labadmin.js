#!/usr/bin/env node

const cli = require('cli');
const seed = require('./commands/seedCmd.js');
const test = require('./commands/testCmd.js');
<<<<<<< HEAD
const init = require('./commands/initCmd.js');
=======
const logger = require('../utils/logger.js');
>>>>>>> master

cli.parse(null, ['test', 'seed', 'init']);

logger.info(`Command is: ${cli.command}`);

switch (cli.command) {
  case 'seed':
    seed();
    break;
  case 'init':
    init();
    break;
  case 'test':
    test();
    break;
  default:
}
