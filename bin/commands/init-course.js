const inquirer = require('inquirer');

const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');
const courses = require('./../../courses/index');

module.exports = async () => {
  // Ask the user which course to initialize
  const courseNames = courses.map(course => course.name);

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'course',
      message: 'Please select a course',
      choices: courseNames
    }
  ]);
  console.log(answers);
  // TODO check if course already exist in DB

  // TODO read the json config file

  await initDB({ force: true });
  // TODO seed the db with a course object

  await closeDB();
};
