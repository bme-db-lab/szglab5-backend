const { seedDBwithJSON } = require('./../../db/seed');
const { initDB, closeDB } = require('./../../db/db');
const path = require('path');
const inquirer = require('inquirer');

module.exports = async (_filePath) => {
  const confirmPromptResult = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'res',
      message: 'Are you sure?'
    }
  ]);
  if (!confirmPromptResult.res) {
    throw new Error('Confirmation error!');
  }

  const filePath = path.isAbsolute(_filePath) ? _filePath : path.join(__dirname, '../..', _filePath);
  const db = await initDB({
    force: true
  });
  try {
    await seedDBwithJSON(db, filePath);
  } catch (err) {
    throw err;
  } finally {
    await closeDB();
  }
};
