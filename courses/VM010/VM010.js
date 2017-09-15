const { seedDBwithObjects } = require('./../../db/seed');
const { getDB } = require('../../db/db.js');
const parseStudents = require('./xls-parsers/StudentParser.js');
const parseStudentRegs = require('./xls-parsers/StudentRegParser.js');
const parseStaff = require('./xls-parsers/StaffParser.js');
const parseExercises = require('./xls-parsers/ExerciseParser.js');
const parseTimetable = require('./xls-parsers/TimetableParser.js');
const parseGroups = require('./xls-parsers/StudentGroupParser.js');
const { updateResource, checkIfExist } = require('../../utils/jsonapi.js');

module.exports = async (semesterId, options) => {
  const db = getDB();
  // get initialized courses from db
  try {
    console.log('initOptions', options);
    const students = await parseStudents(semesterId, options);
    await seedDBwithObjects(db, 'Users', students);
    // set user roles
    const studentRole = await db.Roles.findOne({ where: { name: 'STUDENT' } });
    for (const student of students) {
      const studentRecord = await db.Users.findOne({ where: { neptun: student.data.neptun } });
      const userRole = [{
        data: {
          UserId: studentRecord.dataValues.id,
          RoleId: studentRole.dataValues.id
        }
      }];
      await seedDBwithObjects(db, 'UserRoles', userRole);
    }
    const exercises = await parseExercises(semesterId, options);

    await seedDBwithObjects(db, 'ExerciseTypes', exercises);
    const parsedStaff = await parseStaff(options);
    const staff = parsedStaff.simpleUsers;
    const exList = parsedStaff.exList;
    await seedDBwithObjects(db, 'Users', staff);
    for (const record of exList) {
      const qGuru = await db.Users.findOne({ where: { email_official: record.data.guru } });
      if (record.data.ex !== undefined && record.data.ex !== null) {
        for (const exItem of record.data.ex) {
          const qEx = await db.ExerciseTypes.findOne({ where: { exerciseId: exItem } });
          await db.ExerciseTypes.update({ GuruId: qGuru.dataValues.id }, { where: { id: qEx.dataValues.id } });
        }
      }

      if (record.data.exercises !== undefined && record.data.exercises !== null) {
        const aEx = record.data.exercises.split(',');
        for (const ex of aEx) {
          const qEx = await db.ExerciseTypes.findOne({ where: { exerciseId: ex } });
          const data = [{
            data: {
              ExerciseTypeId: qEx.dataValues.id,
              UserId: qGuru.dataValues.id
            }
          }];
          await seedDBwithObjects(db, 'UserExerciseTypes', data);
        }
      }
    }
    const demonRole = await db.Roles.findOne({ where: { name: 'DEMONSTRATOR' } });
    const correctRole = await db.Roles.findOne({ where: { name: 'CORRECTOR' } });
    const correctors = [];
    for (const member of staff) {
      const memberRecord = await db.Users.findOne({ where: { email_official: member.data.email_official } });
      // process.stdout.write(memberRecord.dataValues.email_official);
      if (memberRecord.dataValues.classroom !== undefined && memberRecord.dataValues.classroom !== null && memberRecord.dataValues.classroom !== '') {
        const userRole = [{
          data: {
            UserId: memberRecord.dataValues.id,
            RoleId: demonRole.dataValues.id
          }
        }];
        await seedDBwithObjects(db, 'UserRoles', userRole);
      }
      const exercisesQuery = await db.UserExerciseTypes.findAll({ where: { UserId: memberRecord.dataValues.id } });
      if (exercisesQuery.length > 0) {
        // process.stdout.write(' +');
        correctors.push(memberRecord.dataValues.email_official);
        const userRole = [{
          data: {
            UserId: memberRecord.dataValues.id,
            RoleId: correctRole.dataValues.id
          }
        }];
        await seedDBwithObjects(db, 'UserRoles', userRole);
      }
      // process.stdout.write('\n');
    }

    const groups = await parseGroups(semesterId, options);
    await seedDBwithObjects(db, 'StudentGroups', groups);
    const regs = await parseStudentRegs(semesterId, options);
    await seedDBwithObjects(db, 'StudentRegistrations', regs);
    const timetable = await parseTimetable(options);
    await seedDBwithObjects(db, 'Appointments', timetable);
  } catch (error) {
    throw error;
  }
};
