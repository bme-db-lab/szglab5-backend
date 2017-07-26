const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');

module.exports = async () => {
  await initDB({ force: true });
  // TODO prompt user for course

  // TODO prompt user for semester

  // TODO generate events, deliverables
  await closeDB();
};
