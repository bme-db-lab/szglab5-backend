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
    const exercises = await parseExercises(semesterId);
    await seedDBwithObjects(db, 'ExerciseTypes', exercises);
    const staff = await parseStaff();
    await seedDBwithObjects(db, 'Users', staff);
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
