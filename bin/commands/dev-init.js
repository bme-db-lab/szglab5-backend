const path = require('path');

const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');
const { seedDBwithJSON, seedDBwithObjects } = require('./../../db/seed');

module.exports = async () => {
  const code = 'VM010';

  // rd then ic
  try {
    const db = await initDB({ force: true });
    const result = await db.Courses.findAll({ where: { codeName: code } });
    if (result !== null && result.length > 0) {
      logger.info('Course was already initialized.');
    } else {
      const relPath = `/courses/${code}/json-config/${code}.config.json`;
      const filePath = path.join(__dirname, '../..', relPath);
      await seedDBwithJSON(db, filePath);
    }
    const semesterData = [{ data: {
      academicyear: '2017/2018',
      academicterm: 1,
      CourseId: 1
    } }];
    await seedDBwithObjects(db, 'Semesters', semesterData);
    const qResult = await db.Semesters.findOne({
      attributes: ['id'],
      where: {
        academicyear: '2017/2018',
        academicterm: 1,
        CourseId: 1
      }
    });
    logger.info('Initializing semester, please wait...');
    const courseMethod = require(`../../courses/${code}/${code}.js`);
    await courseMethod(qResult.dataValues.id);

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
    const srQuery = await db.StudentRegistrations.findAll({ where: { SemesterId: 1 } });
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
  } catch (err) {
    throw err;
  } finally {
    await closeDB();
  }
};
