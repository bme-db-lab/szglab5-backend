const inquirer = require('inquirer');

const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');

module.exports = async () => {
  // prompt user for course
  const db = await initDB();

  const courseQuery = await db.Courses.findAll();
  const courseNames = courseQuery.map(qResult => `${qResult.dataValues.name} - ${qResult.dataValues.codeName}`);

  const courseAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'course',
      message: 'Please select a course',
      choices: courseNames
    }
  ]);
  const courseData = courseAnswers.course.split(' ');
  const code = courseData[2];

  // prompt user for semester
  const semQuery = await db.Semesters.findAll({ where: { CourseCodeName: code } });
  const semNames = semQuery.map(qResult => `${qResult.dataValues.academicyear} - ${qResult.dataValues.academicterm}`);

  const semAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'course',
      message: 'Please select a semester',
      choices: semNames
    }
  ]);

  // TODO generate events, deliverables
  logger.info('Generating Exercise Sheets!');
  // TODO generate exercise sheets
  logger.info('Exercise Sheet generation succeed!');
  logger.info('Generating Events!');
  // TODO generate events
  logger.info('Event generation succeed!');
  logger.info('Generating Deliverables!');
  // TODO generate deliverables
  logger.info('Deliverable generation succeed!');
  await closeDB();
};
