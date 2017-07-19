#!/usr/bin/env node
const yargs = require('yargs');

const seed = require('./commands/seedCmd.js');
const init = require('./commands/initCmd.js');

yargs // eslint-disable-line no-unused-expressions
  .usage('Usage: labadmin <command> [options]')
  .command({
    command: 'seed',
    desc: 'Seed the database with models described in json',
    handler: () => {
      console.log('seed');
    }
  })
  .command({
    command: 'init',
    desc: 'Initialize the database with xls files',
    handler: () => {
      const logger = require('../utils/logger.js');
      logger.info('init');
      console.log('init');
    }
  })
  .option('env', {
    desc: 'Specify run environment',
    default: 'dev'
  })
  .epilog('Laboradmin CLI 2017')
  .help()
  .argv;
