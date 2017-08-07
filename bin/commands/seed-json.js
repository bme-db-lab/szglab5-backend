const { seedDBwithJSON } = require('./../../db/seed');
const { initDB, closeDB } = require('./../../db/db');
const path = require('path');

module.exports = async (_filePath) => {
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
