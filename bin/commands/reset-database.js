const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');
const inquirer = require('inquirer');

module.exports = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'res',
      message: 'Are you sure you want to drop all tables?'
    }
  ]);

  if (answers.res) {
    await initDB({ force: true });
    await closeDB();
    logger.info('Database has been reset!');
  } else {
    logger.info('Cancelled database reset.');
  }
};
