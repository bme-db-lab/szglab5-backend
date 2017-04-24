#!/usr/bin/env node

module.exports = () => {
  const { initDB } = require('../../db/db.js');
  const seed = require('../../db/seedJSON.js');
  const logger = require('../../utils/logger.js');
  logger.info('Old command, for testing other modules. Use init instead if its ready.');
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
};
