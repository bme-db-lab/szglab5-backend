#!/usr/bin/env node

/* const method = process.argv[2];
if (!method) {
  console.log('Please specify the method, with process arguments!');
  process.exit();
}*/

module.exports = () => {
    const { initDB } = require('../../db/db.js');
    const seed = require('../../db/seed.js');
    const logger = require('../../utils/logger.js');
    initDB({
      force: true
    })
    .then(seed)
    .then(() => {
      logger.info('Seed succeed!');
    })
    .catch((err) => {
      logger.error(`Seed failed: ${err.message}`);
    });
}
