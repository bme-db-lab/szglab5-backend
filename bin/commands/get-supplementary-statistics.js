const { initDB, closeDB } = require('../../db/db.js');

module.exports = async (argv) => {
  try {
    const db = await initDB();

    const exerciseCategories = await db.ExerciseCategories.findAll({
      attributes: ['id', 'type']
    });
    const exerciseCategoryNames = exerciseCategories.map(exCat => exCat.type);

    const studentRegs = await db.StudentRegistrations.findAll({
      include: [
        {
          model: db.Events,
          where: { attempt: null },
          include: [
            {
              where: {},
              model: db.Deliverables,
              include: {
                model: db.DeliverableTemplates,
                attributes: ['id', 'description'],
                where: {
                  type: 'FILE'
                }
              }
            },
            {
              model: db.ExerciseSheets,
              include: {
                model: db.ExerciseCategories
              }
            }
          ]
        },
        {
          where: {},
          model: db.Users,
          include: {
            model: db.Roles,
            where: {
              name: 'STUDENT'
            }
          }
        },
        {
          // exclude english and german student group
          where: {
            name: {
              $and: [
                { $ne: 'c16-a1' },
               { $ne: 'c16-a2' },
               { $ne: 'c16-a3' },
              ]
            }
          },
          model: db.StudentGroups
        }
      ]
    });

    const exCatStat = [];
    exerciseCategoryNames.forEach((exCatName) => {
      exCatStat.push({
        exerciseCategoryType: exCatName,
        gradeNotAvailable: 0,
        supplementaryAvailable: 0,
        supplementaryAvailableOptimist: 0,
      });
    });

    for (const studentReg of studentRegs) {
      let failedEvent = null;
      let okEventCount = 0;

      let okEventCountPlus = 0;
      let failedEventPlus = null;

      // console.log(studentReg.id);
      for (const event of studentReg.Events) {
        // console.log(`${event.id}: ${event.grade}`);
        if (event.grade === null) {
          const eventCategory = event.ExerciseSheet.ExerciseCategory.type;
          const index = exCatStat.findIndex(exCatStatItem => exCatStatItem.exerciseCategoryType === eventCategory);
          exCatStat[index].gradeNotAvailable++;
          // console.log(exCatStat[index].exerciseCategoryType, studentReg.User.neptun);
        }

        const deliverableOk = event.Deliverables.every(deliverable => deliverable.uploaded && deliverable.grade >= 2);

        if (event.grade >= 2 || (deliverableOk && event.grade === null)) {
          okEventCountPlus++;
        } else {
          failedEventPlus = event;
        }

        if (event.grade >= 2 || event.grade == null) {
          okEventCount++;
        } else {
          failedEvent = event;
        }
      }

      if (okEventCount === 4) {
        const eventCategory = failedEvent.ExerciseSheet.ExerciseCategory.type;
        const index = exCatStat.findIndex(exCatStatItem => exCatStatItem.exerciseCategoryType === eventCategory);
        exCatStat[index].supplementaryAvailableOptimist++;
      }

      if (okEventCountPlus === 4) {
        const eventCategory = failedEventPlus.ExerciseSheet.ExerciseCategory.type;
        const index = exCatStat.findIndex(exCatStatItem => exCatStatItem.exerciseCategoryType === eventCategory);
        exCatStat[index].supplementaryAvailable++;
      }
    }
    const table = {
      headers: ['exerciseCategoryType', 'gradeNotAvailable', 'supplementaryAvailable', 'supplementaryAvailableOptimist'],
      data: exCatStat
    };

    console.log(table);
  } catch (error) {
    console.log(error);
  } finally {
    await closeDB();
  }
};
