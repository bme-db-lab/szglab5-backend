const path = require('path');
const inquirer = require('inquirer');

const moment = require('moment');
const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');
const { seedDBwithJSON, seedDBwithObjects } = require('./../../db/seed');

module.exports = async (allUser, genPass, hallgatok, beosztas, basePath, initAdminPass, autoYes) => {
  const code = 'VM010';

  const options = {
    allUser: allUser || false,
    genPass: genPass || false,
    xlsBeosztasFileName: beosztas || 'beosztas-minta.xlsx',
    xlsHallgatokFileName: hallgatok || 'hallgatok-minta.xlsx',
    basePath: basePath || 'courses/VM007/xls-data',
    initAdminPass: initAdminPass || '12345',
    autoYes: autoYes || false
  };

  // reset-database then init-course
  try {
    if (!options.autoYes) {
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
    }

    const db = await initDB({ force: true });
    const result = await db.Courses.findAll({ where: { codeName: code } });
    // Initialize Course
    if (result !== null && result.length > 0) {
      logger.info('Course was already initialized.');
    } else {
      const relPath = `/courses/${code}/json-config/${code}.config.json`;
      const filePath = path.join(__dirname, '../..', relPath);
      await seedDBwithJSON(db, filePath);
    }
    // Initialize Semester
    const semesterData = [{ data: {
      academicyear: '2017/2018',
      academicterm: 2,
      CourseId: 1
    } }];
    await seedDBwithObjects(db, 'Semesters', semesterData);
    const qResult = await db.Semesters.findOne({
      attributes: ['id'],
      where: {
        academicyear: '2017/2018',
        academicterm: 2,
        CourseId: 1
      }
    });
    // Generate records for semester - xls parsers
    logger.info('Initializing semester, please wait...');
    const courseMethod = require(`../../courses/${code}/${code}.js`); // eslint-disable-line
    await courseMethod(qResult.dataValues.id, options);

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
    const studentRegs = await db.StudentRegistrations.findAll({ where: { SemesterId: qResult.dataValues.id } });
    for (const studentReg of studentRegs) {
      const appointments = await db.Appointments.findAll({ where: { StudentGroupId: studentReg.dataValues.StudentGroupId } });
      for (const appointment of appointments) {
        // const exerciseSheet = await db.ExerciseSheets.findOne({ where: { ExerciseCategoryId: appointment.dataValues.ExerciseCategoryId, ExerciseTypeId: sr.dataValues.ExerciseTypeId } });
        const eventTemplate = await appointment.getEventTemplate();
        const studentGroup = await db.StudentGroups.findOne({ where: { id: studentReg.dataValues.StudentGroupId } });
        const exerciseSheet = await db.ExerciseSheets.findOne({ where: { ExerciseCategoryId: eventTemplate.dataValues.ExerciseCategoryId, ExerciseTypeId: studentReg.dataValues.ExerciseTypeId } });

        const event = [{ data: {
          date: moment(appointment.dataValues.date).add(15, 'm'),
          location: appointment.dataValues.location,
          StudentRegistrationId: studentReg.dataValues.id,
          EventTemplateId: eventTemplate.id,
          ExerciseSheetId: exerciseSheet.dataValues.id,
          DemonstratorId: studentGroup.UserId
        } }];
        try {
          await seedDBwithObjects(db, 'Events', event);
        } catch (err) {
          throw err;
        }
      }
    }
    logger.info('Event generation succeed!');

    logger.info('Adding admin user');
    const adminLoginName = 'admin';
    const admin = [{
      data: {
        loginName: adminLoginName,
        displayName: 'Admin',
        password: options.initAdminPass
      }
    }];
    await seedDBwithObjects(db, 'Users', admin);

    const adminId = await db.Users.findOne({ where: { loginName: adminLoginName } });
    const roleId = await db.Roles.findOne({ where: { name: 'ADMIN' } });
    const adminRole = [{
      data: {
        RoleId: roleId.dataValues.id,
        UserId: adminId.dataValues.id
      }
    }];
    await seedDBwithObjects(db, 'UserRoles', adminRole);
    logger.info('Succesfully added new admin user!');

    // iterate through event-template's events
    for (let i = 1; i < 6; i++) {
      logger.info(`Generating Deliverables for id=${i} EventTemplate!`);
      const eventTemplate = await db.EventTemplates.findById(i);
      const events = await eventTemplate.getEvents();
      const deliverableTemplates = await eventTemplate.getDeliverableTemplates();
      for (const event of events) {
        logger.debug(`Event: loc - "${event.dataValues.location}" date - "${event.dataValues.date}"`);
        for (const deliverableTemplate of deliverableTemplates) {
          logger.debug(` DeliverableTemplate: type - "${deliverableTemplate.dataValues.type}" name - "${deliverableTemplate.dataValues.name}" desc - "${deliverableTemplate.dataValues.description}"`);
          const eventDate = event.dataValues.date;
          const deadline = moment(eventDate).add(3, 'd');
          // if (i === 0 || i === 1) {
          //   deadline = moment(eventDate).subtract(1, 'y');
          // }
          await db.Deliverables.create({
            deadline,
            EventId: event.dataValues.id,
            DeliverableTemplateId: deliverableTemplate.dataValues.id
          });
        }
      }
    }
    logger.info('Generating Deliverables succeed!');
    // // TODO generate deliverables
    // logger.info('Generating Deliverables!');
    // const eQuery = await db.Events.findAll();
    // for (const event of eQuery) {
    //   const qSr = await db.StudentRegistrations.findOne({ where: { id: event.dataValues.StudentRegistrationId } });
    //   if (qSr.dataValues.SemesterId === 1) {
    //     const qSheet = await db.ExerciseSheets.findOne({ where: { id: event.dataValues.ExerciseSheetId } });
    //     const qCat = await db.ExerciseCategories.findOne({ where: { id: qSheet.dataValues.ExerciseCategoryId } });
    //     const qDelTemp = await db.DeliverableTemplates.findAll({ where: { EventTemplateId: qCat.dataValues.EventTemplateId } });
    //     for (const item of qDelTemp) {
    //       const date = event.dataValues.date;
    //       date.setDate(date.getDate() + 10);
    //       const del = [{ data: {
    //         deadline: date,
    //         EventId: event.dataValues.id,
    //         DeliverableTemplateId: item.dataValues.id
    //       } }];
    //       try {
    //         await seedDBwithObjects(db, 'Deliverables', del);
    //       } catch (err) {
    //         throw err;
    //       }
    //     }
    //   }
    // }
    // logger.info('Deliverable generation succeed!');
  } catch (err) {
    throw err;
  } finally {
    await closeDB();
  }
};
