const config = require('../../config/config');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const makeDir = require('make-dir');

const { getDB } = require('../../db/db');

function generateSpecificPath({ courseCodeName, semesterAcademicYear, semesterAcademicTerm, userNeptun, eventId, exCat, exType }) {
  return path.join(courseCodeName, `${semesterAcademicYear}_${semesterAcademicTerm}`, userNeptun, `${eventId}_${exCat}_${exType}`);
}

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    if (isNaN(reqId)) {
      throw new Error('Request id is invalid');
    }
    const deliverables = await db.Deliverables.findById(reqIdNum);
    const event = await deliverables.getEvent();
    const exSheet = await event.getExerciseSheet();
    const exCat = await exSheet.getExerciseCategory();
    const exType = await exSheet.getExerciseType();
    const studentReg = await event.getStudentRegistration();
    const user = await studentReg.getUser();
    const semester = await studentReg.getSemester();
    const course = await semester.getCourse();

    const uploadedFile = req.file;
    const { currentStorage } = config.uploadFile;

    const specificPath = generateSpecificPath({
      courseCodeName: course.codeName,
      semesterAcademicYear: semester.academicyear.replace('/', '_'),
      semesterAcademicTerm: semester.academicterm,
      userNeptun: user.neptun,
      eventId: event.id,
      exCat: exCat.type,
      exType: exType.shortName
    });

    const dateTime = moment().format('YYYY_MM_DD-hh_mm');
    const newFileName = `${user.neptun}_${dateTime}_${uploadedFile.originalname}`;
    const savePath = path.join(currentStorage.resolvedRootPath, specificPath, newFileName);
    await makeDir(path.dirname(savePath));

    await promisify(fs.writeFile)(savePath, uploadedFile.buffer);

    res.send('ok');
  } catch (err) {
    res.status(500).send({
      errors: [
        {
          message: err.message
        }
      ]
    });
  }
};
