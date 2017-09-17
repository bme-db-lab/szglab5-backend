const { initDB, closeDB } = require('../../db/db.js');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

module.exports = async () => {
  try {
    const db = await initDB();

    const jsonPrompt = await inquirer.prompt({
      type: 'input',
      default: 'student-exercise-types.json',
      message: 'Give JSON file, relative to ./data',
      name: 'path'
    });

    const jsonFile = fs.readFileSync(path.join(__dirname, 'data', jsonPrompt.path));
    const studentExTypes = JSON.parse(jsonFile);

    // create exerciseTypes if not exist
    const exerciseIds = studentExTypes.map(studentExType => studentExType.exerciseId);
    exerciseIds.sort();
    const uniqExerciseIds = new Set(exerciseIds);
    console.log('Checking exercise ids');
    for (const exerciseId of uniqExerciseIds) {
      const exType = await db.ExerciseTypes.find({ where: { exerciseId } });
      if (!exType) {
        console.log(`  ExerciseId "${exerciseId}" not exist, will create it`);
        const createdExType = await db.ExerciseTypes.create({
          name: exerciseId,
          shortName: exerciseId,
          exerciseId
        });
        const exCategories = await db.ExerciseCategories.findAll();
        for (const exCategory of exCategories) {
          console.log(`    Generating sheet: exCat: ${exCategory.dataValues.type}`);
          await db.ExerciseSheets.create({
            ExerciseTypeId: createdExType.id,
            ExerciseCategoryId: exCategory.id
          });
        }
      } else {
        console.log(`  ExerciseId "${exerciseId}" exist`);
      }
    }
    // Set student's exercise types
    for (const studentExType of studentExTypes) {
      const student = await db.Users.find({ where: { neptun: studentExType.neptun } });
      if (student) {
        console.log(`Set student "${student.dataValues.neptun}" exercise to "${studentExType.exerciseId}"`);
        const studentRegs = await student.getStudentRegistrations();
        const currentExType = await db.ExerciseTypes.find({ where: { exerciseId: studentExType.exerciseId } });

        // TODO: choose the active semester
        const studentReg = studentRegs[0];
        await studentReg.updateAttributes({
          ExerciseTypeId: currentExType.id
        });
        console.log('Set events sheet');
        const events = await studentReg.getEvents();
        for (const event of events) {
          const eventTemplate = await event.getEventTemplate({
            include: {
              model: db.ExerciseCategories
            }
          });
          console.log(`    exCat: ${eventTemplate.dataValues.ExerciseCategory.type} exType: ${currentExType.dataValues.shortName}`);

          const exSheet = await db.ExerciseSheets.find({
            where: {
              ExerciseTypeId: currentExType.id,
              ExerciseCategoryId: eventTemplate.dataValues.ExerciseCategory.id
            }
          });

          await event.updateAttributes({
            ExerciseSheetId: exSheet.id
          });
        }
      } else {
        console.log(`Student not found with neptun "${studentExType.neptun}"`);
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    await closeDB();
  }
};
