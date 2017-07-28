const inquirer = require('inquirer');
const path = require('path');

const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');
const courses = require('./../../courses/index');
const { seedDBwithJSON } = require('./../../db/seed');

module.exports = async () => {
  // Ask the user which course to initialize
  const courseNames = courses.map(course => `${course.name} - ${course.code}`);

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'course',
      message: 'Please select a course',
      choices: courseNames
    }
  ]);
  const courseData = answers.course.split(' ');
  const code = courseData[2];

  // check if course already exist in DB, load json if not
  try {
    const db = await initDB();
    const result = await db.Courses.findAll({ where: { codeName: code } });
    if (result !== null && result.length > 0) {
      logger.info('Course was already initialized.');
    } else {
      const relPath = `/courses/${code}/json-config/${code}.config.json`;
      const filePath = path.join(__dirname, '../..', relPath);
      await seedDBwithJSON(db, filePath);
    }
  } catch (err) {
    throw err;
  } finally {
    await closeDB();
  }
};
