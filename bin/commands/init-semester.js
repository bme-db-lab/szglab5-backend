const inquirer = require('inquirer');
const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');

module.exports = async () => {
  // get initialized courses from db
  const db = await initDB();
  const result = await db.Courses.findAll();

  const courseNames = result.map(course => `${course.dataValues.name} - ${course.dataValues.codeName}`);

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

  // TODO switch-case to selected course type
  switch (answers.course) {
    case 'adatlabor': {
      // prompt the user for USER xls path
      const userPath = await inquirer.prompt([
        {
          type: 'input',
          name: 'path',
          default: `/courses/${code}/xls-data/hallgatok-minta.xlsx`,
          message: 'Please choose an xls path for user data (relative to project root)'
        }
      ]);
      // prompt the user for BEOSZTAS xls path
      const staffPath = await inquirer.prompt([
        {
          type: 'input',
          name: 'path',
          default: `/courses/${code}/xls-data/hallgatok-minta.xlsx`,
          message: 'Please choose an xls path for staff data (relative to project root)'
        }
      ]);
      
      // TODO seed the db models
      break;
    }
    default: {
      logger.warn(`Unknown course type: ${answers.course}`);
      break;
    }
  }

  await closeDB();
};
