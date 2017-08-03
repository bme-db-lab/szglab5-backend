const { seedDBwithObjects } = require('./../../db/seed');
const { getDB, closeDB } = require('../../db/db.js');
const parseStudents = require('./xls-parsers/StudentParser.js');
const parseStaff = require('./xls-parsers/StaffParser.js');
const parseExercises = require('./xls-parsers/ExerciseParser.js');
const parseTimetable = require('./xls-parsers/TimetableParser.js');
const parseGroups = require('./xls-parsers/StudentGroupParser.js');

module.exports = async (semesterId) => {
  const db = getDB();
  // get initialized courses from db
  try {
    const students = parseStudents(semesterId);
    const staff = parseStaff();
    const exercises = parseExercises();
    const timetable = parseTimetable();
    const groups = parseGroups(semesterId);
    await seedDBwithObjects(db, 'Users', students.users);
    await seedDBwithObjects(db, 'ExerciseTypes', exercises);
    await seedDBwithObjects(db, 'Users', staff);
    await seedDBwithObjects(db, 'StudentGroups', groups);
    await seedDBwithObjects(db, 'StudentRegistrations', students.regs);
    await seedDBwithObjects(db, 'Appointments', timetable);
  } catch (error) {
    throw error;
  }
};
