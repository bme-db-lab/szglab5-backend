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
    console.log(req.userInfo);
    const { roles } = req.userInfo;
    // TODO: STUDENT csak saját deliverables
    if (roles.includes('STUDENT')) {

    } else if (roles.includes('ADMIN') || roles.includes('CORRECTOR') || roles.includes('')) {

    }

    const deliverables = await db.Deliverables.findById(reqIdNum);
    const delTempl = await deliverables.getDeliverableTemplate();
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
    let AKEPFileEnding = '';
    if (delTempl.dataValues.AKEP) {
      AKEPFileEnding = `_AKEP_${exCat.type}_${exType.shortName}_${user.neptun}`;
    }

    const semesterForFileName = `${semester.academicyear.replace('/', '_')}_${semester.academicterm}`;
    const newFileName = `${course.codeName}_${semesterForFileName}_${dateTime}_${uploadedFile.originalname}_${delTempl.name}_${AKEPFileEnding}`;
    const savePath = path.join(currentStorage.resolvedRootPath, specificPath, newFileName);
    await makeDir(path.dirname(savePath));

    await promisify(fs.writeFile)(savePath, uploadedFile.buffer);

    const deliverableUpdate = {
      uploaded: true,
      filePath: savePath,
      lastSubmittedDate: new Date()
    };

    // TODO ONLY FOR TEST WEEKEND
    if (Math.floor(Math.random() * 2) === 0) {
      deliverableUpdate.deadline = '2013-09-09T02:31:24.530Z';
    }

    await deliverables.update(deliverableUpdate);
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
