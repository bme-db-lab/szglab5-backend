const { initDB, closeDB } = require('../../db/db.js');
const json2csv = require('json2csv');
const fs = require('fs');
const path = require('path');

module.exports = async (argv) => {
  try {
    const db = await initDB();

    const studentRegs = await db.StudentRegistrations.findAll({
      include: [
        {
          model: db.ExerciseTypes
        },
        {
          model: db.Users
        }
      ]
    });
    const exTypesRecords = await db.ExerciseTypes.findAll();
    const exTypes = exTypesRecords.map(exTypeRecord => ({
      id: exTypeRecord.id,
      exerciseId: exTypeRecord.dataValues.exerciseId,
      shortName: exTypeRecord.dataValues.shortName,
      count: 0
    }));
    console.log(`Student registrations count: ${studentRegs.length}`);
    studentRegs.forEach((studentReg) => {
      const actExType = exTypes.find(exType => exType.id === studentReg.dataValues.ExerciseTypeId);
      if (actExType) {
        actExType.count += 1;
      }
    });
    console.log(exTypes);

    const studentExTypes = studentRegs.map(
      studentReg => ({
        neptun: studentReg.dataValues.User.dataValues.neptun,
        feladat_tipus: studentReg.dataValues.ExerciseType.dataValues.shortName
      })
    );
    const fields = ['neptun', 'feladat_tipus'];
    const result = json2csv({ data: studentExTypes, fields });
    const pathToWrite = path.join(__dirname, argv.outputFilename);
    fs.writeFileSync(pathToWrite, result);
    console.log(`CSV file created at: ${pathToWrite}`);
  } catch (err) {
    console.log(err);
  } finally {
    await closeDB();
  }
};
