const { seedDBwithObjects } = require('./../../db/seed');
const { getDB } = require('../../db/db.js');
const parseStudents = require('./xls-parsers/StudentParser.js');
const parseStudentRegs = require('./xls-parsers/StudentRegParser.js');
const parseStaff = require('./xls-parsers/StaffParser.js');
const parseExercises = require('./xls-parsers/ExerciseParser.js');
const parseTimetable = require('./xls-parsers/TimetableParser.js');
const parseGroups = require('./xls-parsers/StudentGroupParser.js');

module.exports = async (semesterId) => {
  const db = getDB();
  // get initialized courses from db
  try {
    const students = await parseStudents(semesterId);
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
    const exercises = await parseExercises(semesterId);
    await seedDBwithObjects(db, 'ExerciseTypes', exercises);
    const staff = await parseStaff();
    await seedDBwithObjects(db, 'Users', staff);
    const demonRole = await db.Roles.findOne({ where: { name: 'DEMONSTRATOR' } });
    for (const staffMember of staff) {
      const staffMemberRecord = await db.Users.findOne({ where: { email_official: staffMember.data.email_official } });
      const userRole = [{
        data: {
          UserId: staffMemberRecord.dataValues.id,
          RoleId: demonRole.dataValues.id
        }
      }];
      await seedDBwithObjects(db, 'UserRoles', userRole);
    }
    const groups = await parseGroups(semesterId);
    await seedDBwithObjects(db, 'StudentGroups', groups);
    const regs = await parseStudentRegs(semesterId);
    await seedDBwithObjects(db, 'StudentRegistrations', regs);
    const timetable = await parseTimetable();
    await seedDBwithObjects(db, 'Appointments', timetable);
  } catch (error) {
    throw error;
  }
};
