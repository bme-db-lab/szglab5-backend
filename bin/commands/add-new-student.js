const inquirer = require('inquirer');
const generator = require('generate-password');
const bcrypt = require('bcrypt');
const moment = require('moment');

const { initDB, closeDB } = require('../../db/db.js');
const config = require('../../config/config');

module.exports = async () => {
  try {
    const db = await initDB();


    const courses = await db.Courses.findAll();
    const courseChoices = courses.map(course => (
      {
        name: `${course.dataValues.name} - ${course.dataValues.codeName}`,
        value: course.dataValues.id
      }
    ));

    const courseAnswers = await inquirer.prompt([
      {
        type: 'list',
        name: 'courseId',
        message: 'Please select a course',
        choices: courseChoices
      }
    ]);
    const courseId = courseAnswers.courseId;

    // prompt user for semester
    const semesters = await db.Semesters.findAll({ where: { CourseId: courseId } });
    const semesterChoices = semesters.map(semester => ({
      name: `${semester.dataValues.academicyear} - ${semester.dataValues.academicterm}`,
      value: semester.id
    }));

    const semAnswers = await inquirer.prompt([
      {
        type: 'list',
        name: 'semesterId',
        message: 'Please select a semester',
        choices: semesterChoices
      }
    ]);
    const semester = await db.Semesters.findById(semAnswers.semesterId);

    const studentGroups = await db.StudentGroups.findAll();
    const studentGroupsChoices = [];
    for (const studentGroup of studentGroups) {
      studentGroupsChoices.push({
        name: studentGroup.name,
        value: studentGroup.id
      });
    }
    const newUserPromptResult = await inquirer.prompt([
      {
        type: 'input',
        name: 'neptun',
        message: 'Neptun'
      },
      {
        type: 'input',
        name: 'displayName',
        message: 'Full name'
      },
      {
        type: 'list',
        name: 'studentGroupId',
        message: 'New student group',
        choices: studentGroupsChoices
      }
    ]);

    // \Randomize\ -> Prompt exerciseTypes for student reg
    const exTypes = await db.ExerciseTypes.findAll();
    const exTypeChoices = exTypes.map(exType => ({
      value: exType.id,
      name: exType.shortName
    }));
    const exTypeAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'exTypeId',
        message: 'Please select an exerciseType',
        choices: exTypeChoices
      }
    ]);
    // const randomExerciseType = exTypes[Math.floor(Math.random() * exTypes.length)];

    const initPassword = generator.generate({
      length: 10,
      numbers: true,
      excludeSimilarCharacters: true
    });
    console.log(`Generated password is "${initPassword}" for "${newUserPromptResult.neptun}"`);
    const passwordHash = bcrypt.hashSync(initPassword, config.bcrypt.saltRounds);

    // Create User
    const newUser = await db.Users.create({
      neptun: newUserPromptResult.neptun,
      loginName: newUserPromptResult.neptun,
      displayName: newUserPromptResult.displayName,
      password: passwordHash,
    });

    // Add student role to user
    const studentRole = await db.Roles.find({
      where: { name: 'STUDENT' }
    });
    if (!studentRole) {
      throw new Error('Student role not found');
    }
    const newUserStudentRole = await db.UserRoles.create({
      UserId: newUser.id,
      RoleId: studentRole.id
    });

    const studentGroup = await db.StudentGroups.findById(newUserPromptResult.studentGroupId);
    // Create Student Registration
    const studentReg = await db.StudentRegistrations.create({
      neptunSubjectCode: 'N/A',
      neptunCourseCode: studentGroup.name,
      LanguageId: 1,
      SemesterId: semester.id,
      StudentGroupId: studentGroup.id,
      UserId: newUser.id,
      ExerciseTypeId: exTypeAnswer.exTypeId
    });
    // Generate Events
    console.log('Generating events...');
    const appointments = await db.Appointments.findAll({ where: { StudentGroupId: studentReg.dataValues.StudentGroupId } });
    for (const appointment of appointments) {
      // const exerciseSheet = await db.ExerciseSheets.findOne({ where: { ExerciseCategoryId: appointment.dataValues.ExerciseCategoryId, ExerciseTypeId: sr.dataValues.ExerciseTypeId } });
      const eventTemplate = await appointment.getEventTemplate();
      const exerciseSheet = await db.ExerciseSheets.findOne({ where: { ExerciseCategoryId: eventTemplate.dataValues.ExerciseCategoryId, ExerciseTypeId: studentReg.dataValues.ExerciseTypeId } });

      const newEvent = await db.Events.create({
        date: moment(appointment.dataValues.date).add(15, 'm'),
        location: appointment.dataValues.location,
        StudentRegistrationId: studentReg.dataValues.id,
        EventTemplateId: eventTemplate.id,
        ExerciseSheetId: exerciseSheet.dataValues.id,
        DemonstratorId: studentGroup.UserId
      });
      console.log(`  Event: loc - "${newEvent.dataValues.location}" date - "${newEvent.dataValues.date}"`);
      // Generate Deliverables
      if (eventTemplate.id > 5) {
        continue;
      }
      const deliverableTemplates = await eventTemplate.getDeliverableTemplates();
      for (const deliverableTemplate of deliverableTemplates) {
        console.log(`    DeliverableTemplate: type - "${deliverableTemplate.dataValues.type}" name - "${deliverableTemplate.dataValues.name}" desc - "${deliverableTemplate.dataValues.description}"`);
        const eventDate = newEvent.dataValues.date;
        const deadline = moment(eventDate).add(2, 'd');
        // if (i === 0 || i === 1) {
        //   deadline = moment(eventDate).subtract(1, 'y');
        // }
        await db.Deliverables.create({
          deadline,
          EventId: newEvent.id,
          DeliverableTemplateId: deliverableTemplate.id
        });
      }
    }
    console.log('Events generated!');
  } catch (err) {
    console.log(err);
  } finally {
    await closeDB();
  }
};
