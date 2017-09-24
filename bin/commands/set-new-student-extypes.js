const { initDB, closeDB } = require('../../db/db.js');
const inquirer = require('inquirer');

const studentGroupsNotToUpdate = [
  'c12-A'
];

module.exports = async () => {
  try {
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
    const db = await initDB();

    const studentGroups = await db.StudentGroups.findAll();
    const exTypes = await db.ExerciseTypes.findAll();
    let currentExTypeIndex = 0;

    for (const studentGroup of studentGroups) {
      console.log(`Student group: ${studentGroup.dataValues.name}`);
      if (studentGroupsNotToUpdate.includes(studentGroup.dataValues.name)) {
        continue;
      }
      const studentRegs = await studentGroup.getStudentRegistrations({
        include: {
          model: db.Users
        }
      });
      for (const studentReg of studentRegs) {
        // generate new exercise-types
        const currentExType = exTypes[currentExTypeIndex];
        console.log(`  Student "${studentReg.dataValues.User.neptun}" - ${currentExType.dataValues.shortName}`);
        await studentReg.update({
          ExerciseTypeId: currentExType.id
        });
        // set new exercise sheets for the upcomming events
        const events = await studentReg.getEvents({
          include: {
            model: db.EventTemplates
          }
        });
        for (const event of events) {
          if (event.dataValues.EventTemplateId === 1) {
            continue;
          }
          const exSheet = await db.ExerciseSheets.find({
            where: {
              ExerciseCategoryId: event.dataValues.EventTemplate.dataValues.ExerciseCategoryId,
              ExerciseTypeId: currentExType.id
            }
          });
          if (!exSheet) {
            continue;
          }
          await event.update({
            ExerciseSheetId: exSheet.id
          });
        }
        if (currentExTypeIndex < exTypes.length - 1) {
          currentExTypeIndex += 1;
        } else {
          currentExTypeIndex = 0;
        }
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    await closeDB();
  }
};
