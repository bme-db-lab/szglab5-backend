#!/usr/bin/env node

module.exports = () => {
  const { initDB } = require('../../db/db.js');
  const init = require('../../db/seedXLS.js');
  initDB({
    force: true
  })
  .then(init)
  .then(() => {
    logger.info('Init succeed!');
  })
  .catch((err) => {
    logger.error(`Init failed: ${err.message}`);
  });
};
