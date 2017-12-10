const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('../../utils/utils.js');

// Spec in hungarian
// Azok potolhatnak, akiknek legfeljebb egy laborja elegtelen vagy egy laborjegye hianyzik.
// A beosztas elkeszitesehez egy olyan tablazat kell, ami azt mutatja meg, hogy labortipusonkent hany hallgato van, aki az elobbiek szerint potolhat, es hany olyan hallgato van, akinek az adott labortipushoz tartozo jegye meg hianyzik. A potlok szamanak meghatarozasa soran azt kell feltetelezni, hogy ha valakinek meg hianyzik laborjegye, akkor feltesszuk, hogy az  elegtelentol kulonbozo lesz (erre azert van szukseg, mert a potlas beosztasat hamarabb el kell kesziteni, mintsem valamennyi jkv. ki lenne javitva). Celszeruen egy ilyen lekerdezest barmikor le lehessen futtatni.

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const { roles } = req.userInfo;

    // only ADMIN DEMONSTRATOR CORRECTOR
    if (!roles.includes('ADMIN') && !roles.includes('DEMONSTRATOR') && !roles.includes('CORRECTOR')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

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

    res.send(table);
  } catch (error) {
    res.status(500).send(genErrorObj(error.message));
  }
};
