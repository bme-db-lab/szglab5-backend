const inquirer = require('inquirer');
const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');
const { seedDBwithObjects } = require('./../../db/seed');

module.exports = async (hallgatoXls, beosztasXls) => {
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
  try {
    const year = await inquirer.prompt([
      {
        type: 'input',
        name: 'res',
        message: 'Please type in the starting year of the semester.',
      }
    ]);
    const terms = ['Autumn (1)', 'Spring (2)'];
    const half = await inquirer.prompt([
      {
        type: 'list',
        name: 'res',
        message: 'Please select the term of the semester.',
        choices: terms
      }
    ]);
    const yearInfo = `${year.res}/${parseInt(year.res, 10) + 1}`;
    logger.info(`The selected semester is ${yearInfo} - ${half.res}`);
    const term = half.res === 'Autumn (1)' ? 1 : 2;
    const cQueryResult = await db.Courses.findOne({
      attributes: ['id'],
      where: {
        codeName: code
      }
    });
    const semesterData = [{ data: {
      academicyear: yearInfo,
      academicterm: term,
      CourseId: cQueryResult.dataValues.id
    } }];
    await seedDBwithObjects(db, 'Semesters', semesterData);
    const qResult = await db.Semesters.findOne({
      attributes: ['id'],
      where: {
        academicyear: yearInfo,
        academicterm: term,
        CourseId: cQueryResult.dataValues.id
      }
    });
    logger.info('Initializing semester, please wait...');
    const courseMethod = require(`../../courses/${code}/${code}.js`);
    await courseMethod(qResult.dataValues.id, {
      allUser: true,
      genPass: true,
      xlsBeosztasFileName: hallgatoXls || 'beosztas-minta',
      xlsHallgatokFileName: beosztasXls || 'hallgatok-minta'
    });
  } catch (err) {
    throw err;
  } finally {
    await closeDB();
  }
};
