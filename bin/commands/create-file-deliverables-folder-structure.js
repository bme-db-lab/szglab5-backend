const { isAbsolute, join } = require('path');
const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');
const inquirer = require('inquirer');
const config = require('../../config/config');

module.exports = async () => {
  try {
    logger.info('Creating file folder structure for file derivelables');
    const db = await initDB();
      // prompt for course
    const courses = await db.Courses.findAll();
    const courseChoices = courses.map(course => ({
      name: `${course.dataValues.name} - ${course.dataValues.codeName}`,
      value: course.dataValues.id
    }));
    console.log(__dirname);

    const courseChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'courseId',
        message: 'Please select a course',
        choices: courseChoices
      }
    ]);
    const selectedCourse = await db.Courses.findById(courseChoice.courseId);
  // prompt for semester
    const semesters = await selectedCourse.getSemesters();
    const semesterChoices = semesters.map(semester => ({
      name: `${semester.dataValues.academicyear} / ${semester.dataValues.academicterm}`,
      value: semester.dataValues.id
    }));
    const semesterChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'semesterId',
        message: 'Please select a semester',
        choices: semesterChoices
      }
    ]);
    const selectedSemester = await db.Semesters.findById(semesterChoice.semesterId);

    const path = isAbsolute(config.uploadFile.rootPath) ? config.uploadFile.rootPath : join(__dirname, config.uploadFile.rootPath);
    // generate folder structure
    const studentRegs = await selectedSemester.getStudentRegistrations();
    logger.debug(`Found ${studentRegs.length} student registration`);
    for (const studentReg of studentRegs) {
      const student = await studentReg.getUser();
      logger.debug(` Student: ${student.dataValues.displayName} - ${student.dataValues.neptun}`);
      const studentRegEvents = await studentReg.getEvents();
      for (const studentRegEvent of studentRegEvents) {
        const exerciseSheet = await studentRegEvent.getExerciseSheet();
        const exerciseType = await exerciseSheet.getExerciseType();
        const exerciseCategory = await exerciseSheet.getExerciseCategory();

        logger.debug(`  Event: loc: ${studentRegEvent.dataValues.location} - date: ${studentRegEvent.dataValues.date} - category: ${exerciseCategory.type} - type: ${exerciseType.name}`);
      }
    }
  } catch (err) {
    throw err;
  } finally {
    closeDB();
  }
};
