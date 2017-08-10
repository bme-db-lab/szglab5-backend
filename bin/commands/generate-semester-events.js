const inquirer = require('inquirer');

const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');
const { seedDBwithObjects } = require('./../../db/seed');

module.exports = async () => {
  // prompt user for course
  const db = await initDB();

  const courseQuery = await db.Courses.findAll();
  const courseNames = courseQuery.map(qResult => `${qResult.dataValues.id}:  ${qResult.dataValues.name} - ${qResult.dataValues.codeName}`);

  const courseAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'course',
      message: 'Please select a course',
      choices: courseNames
    }
  ]);
  const courseData = courseAnswers.course.split(':');
  const courseId = courseData[0];

  // prompt user for semester
  const semQuery = await db.Semesters.findAll({ where: { CourseId: courseId } });
  const semNames = semQuery.map(qResult => `${qResult.dataValues.id}:  ${qResult.dataValues.academicyear} - ${qResult.dataValues.academicterm}`);

  const semAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'course',
      message: 'Please select a semester',
      choices: semNames
    }
  ]);

  // generate exercise sheets
  logger.info('Generating Exercise Sheets!');
  const etQuery = await db.ExerciseTypes.findAll();
  const ecQuery = await db.ExerciseCategories.findAll();
  for (const cat of ecQuery) {
    for (const type of etQuery) {
      const sheet = [{ data: { ExerciseCategoryId: cat.dataValues.id, ExerciseTypeId: type.dataValues.id } }];
      try {
        await seedDBwithObjects(db, 'ExerciseSheets', sheet);
      } catch (err) {
        throw err;
      }
    }
  }
  logger.info('Exercise Sheet generation succeed!');

  // generate events
  logger.info('Generating Events!');
  const srQuery = await db.StudentRegistrations.findAll();
  for (const sr of srQuery) {
    const appQuery = await db.Appointments.findAll({ where: { StudentGroupId: sr.dataValues.StudentGroupId } });
    for (const app of appQuery) {
      const shQuery = await db.ExerciseSheets.findOne({ where: { ExerciseCategoryId: app.dataValues.ExerciseCategoryId, ExerciseTypeId: sr.dataValues.ExerciseTypeId } });
      const sgQuery = await db.StudentGroups.findOne({ where: { id: sr.dataValues.StudentGroupId } });
      const event = [{ data: {
        date: app.dataValues.date,
        location: app.dataValues.location,
        StudentRegistrationId: sr.dataValues.id,
        ExerciseSheetId: shQuery.dataValues.id,
        DemonstratorId: sgQuery.UserId
      } }];
      try {
        await seedDBwithObjects(db, 'Events', event);
      } catch (err) {
        throw err;
      }
    }
  }

  logger.info('Event generation succeed!');

  // TODO generate deliverables
  logger.info('Generating Deliverables!');
  const eQuery = await db.Events.findAll();
  for (const event of eQuery) {
    const qSheet = await db.ExerciseSheets.findOne({ where: { id: event.dataValues.ExerciseSheetId } });
    const qCat = await db.ExerciseCategories.findOne({ where: { id: qSheet.dataValues.ExerciseCategoryId } });
    const qDelTemp = await db.DeliverableTemplates.findAll({ where: { EventTemplateId: qCat.dataValues.EventTemplateId } });
    for (const item of qDelTemp) {
      const date = event.dataValues.date;
      date.setDate(date.getDate() + 10);
      const del = [{ data: {
        deadline: date,
        EventId: event.dataValues.id,
        DeliverableTemplateId: item.dataValues.id
      } }];
      try {
        await seedDBwithObjects(db, 'Deliverables', del);
      } catch (err) {
        throw err;
      }
    }
  }
  logger.info('Deliverable generation succeed!');
  await closeDB();
};
