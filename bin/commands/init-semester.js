const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');

module.exports = async () => {
  await initDB({ force: true });
  // TODO read already initialized coursed from db

  // TODO prompt the user in which course to initialize a semester

  // TODO switch-case to selected course type
  switch (courseType) {
    case 'adatlabor':
      // TODO prompt the user for USER xls path

      // TODO prompt the user for BEOSZTAS xls path

      // TODO seed the db models
      break;
    default:
      logger.warn(`Unknown course type: ${courseType}`);
      break;
  }

  await closeDB();
};
