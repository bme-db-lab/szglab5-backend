#!/usr/bin/env node
const yargs = require('yargs');

yargs // eslint-disable-line no-unused-expressions
  .usage('Usage: labadmin <command> [options]')
  .command({
    command: 'seed-json',
    aliases: ['sj'],
    desc: 'Seed the database with models described in json',
    builder: () => yargs
          .option('path', {
            alias: 'p',
            default: 'courses/VM010/json-data/dev.seed.json'
          }),
    handler: async (argv) => {
      const logger = require('../utils/logger.js');
      const seedJSON = require('./commands/seed-json');
      try {
        await seedJSON(argv.path);
        logger.info('Seed succeed');
      } catch (err) {
        logger.error('Error while seed from JSON file');
        logger.error(err);
      }
    }
  })
  .command({
    command: 'init-course',
    aliases: ['ic'],
    desc: 'Initialize a new course',
    handler: async () => {
      const logger = require('../utils/logger.js');
      try {
        const initCourse = require('./commands/init-course');
        await initCourse();
        logger.info('Course initializing succeed!');
      } catch (err) {
        logger.error('Error while initializing course');
        logger.error(err);
      }
    }
  })
  .command({
    command: 'init-semester',
    aliases: ['is'],
    desc: 'Initalize a new semester in a course',
    handler: async () => {
      const logger = require('../utils/logger.js');
      try {
        const initSemester = require('./commands/init-semester');
        await initSemester();
        logger.info('Semester initializing succeed!');
      } catch (err) {
        logger.error('Error while initializing semester');
        logger.error(err);
      }
    }
  })
  .command({
    command: 'generate-semester-events',
    aliases: ['gse'],
    desc: 'Generate events in a selected semester',
    handler: async () => {
      const logger = require('../utils/logger.js');
      try {
        const generateSemesterEvents = require('./commands/generate-semester-events');
        await generateSemesterEvents();
        logger.info('Event generation succeed!');
      } catch (err) {
        logger.error('Error while event generation');
        logger.error(err);
      }
    }
  })
   .command({
     command: 'reset-database',
     aliases: ['rd'],
     desc: 'Drops all tables from the database.',
     handler: async () => {
       const logger = require('../utils/logger.js');
       try {
         const resetDatabase = require('./commands/reset-database');
         await resetDatabase();
       } catch (err) {
         logger.error('Error while resetting database');
         logger.error(err);
       }
     }
   })
  .command({
    command: 'create-git-users',
    aliases: ['cgu'],
    desc: 'Initialize git users',
    handler: async () => {
      const logger = require('../utils/logger.js');
      try {
        const createGitUsers = require('./commands/create-gitlab-users.js');
        await createGitUsers();
      } catch (err) {
        logger.error('Error while creating gitlab users');
        logger.error(err);
      }
    }
  })
  .command({
    command: 'dev-init',
    aliases: ['di'],
    desc: 'Shortcut for rd -> ic -> is -> gse',
    handler: async () => {
      const logger = require('../utils/logger.js');
      try {
        const init = require('./commands/dev-init.js');
        await init();
      } catch (err) {
        logger.error('Error while executing init');
        logger.error(err);
      }
    }
  })
  .command({
    command: 'create-admin',
    aliases: ['ca'],
    desc: 'Create admin user',
    handler: async () => {
      const logger = require('../utils/logger.js');
      try {
        const createAdmin = require('./commands/create-admin.js');
        await createAdmin();
      } catch (err) {
        logger.error('Error while executing init');
        logger.error(err);
      }
    }
  })
  .option('env', {
    desc: 'Specify run environment',
    default: 'dev'
  })
  .epilog('Laboradmin CLI 2017')
  .help()
  .argv;
