const json2csv = require('json2csv');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

const { initDB, closeDB } = require('../../db/db.js');

module.exports = async (argv) => {
  try {
    const db = await initDB();

    const exerciseCategories = await db.ExerciseCategories.findAll({
      attributes: ['id', 'type'],
      where: {
        type: {
          $and: [{ $ne: 'zh2020osz' }, { $ne: 'pzh2020osz' }],
        },
      },
    });
    const exerciseCategoryNames = exerciseCategories.map((exCat) => exCat.type);

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
                  type: 'FILE',
                },
              },
            },
            {
              model: db.ExerciseSheets,
              include: {
                model: db.ExerciseCategories,
              },
            },
            {
              model: db.EventTemplates,
              where: {
                type: 'Labor',
              },
            },
          ],
        },
        {
          where: {},
          model: db.Users,
          include: {
            model: db.Roles,
            where: {
              name: 'STUDENT',
            },
          },
        },
        {
          // exclude english and german student group
          where: {
            name: {
              $and: [{ $ne: 'cs16a-1' }, { $ne: 'cs16a-2' }, { $ne: 'cs16a-3' }],
            },
          },
          model: db.StudentGroups,
        },
      ],
    });

    const exCatStat = exerciseCategoryNames.reduce((acc, cur) => {
      return {
        [cur]: 0,
        ...acc,
      };
    }, {});

    const eventOkFunc = (event) => {
      const eventOk = event.grade >= 2;
      const deliverableOk = event.Deliverables.every(
        (deliverable) => deliverable.uploaded && deliverable.grade >= 2
      );

      return eventOk || (deliverableOk && event.grade === null) || moment(event.date).isBetween(moment('2024-11-29T00:00:00.000Z'), moment('2024-11-29T23:59:00.000Z'));
    };

    const studentRegsWithSupplementary = studentRegs.filter((studentReg) => {
      const okEvents = studentReg.Events.filter(eventOkFunc);
      return okEvents.length === studentReg.Events.length - 1;
    });

    const supplementaryData = [];
    studentRegsWithSupplementary.forEach((supplementaryStudentReg) => {
      const failedEvent = supplementaryStudentReg.Events.find((event) =>
        !eventOkFunc(event)
      );

      exCatStat[failedEvent.ExerciseSheet.ExerciseCategory.type] += 1;
      supplementaryData.push({
        Neptun: supplementaryStudentReg.User.neptun,
        ExerciseCategory: failedEvent.ExerciseSheet.ExerciseCategory.type,
      });
    });

    const stats = {
      headers: ['exerciseCategoryType', 'supplementaryAvailable'],
      data: exCatStat,
    };
    console.log(stats);

    const fields = ['Neptun', 'ExerciseCategory'];
    const result = json2csv({ data: supplementaryData, fields });
    const pathToWrite = path.join(
      __dirname,
      `supplementary_stats_${moment().format('YYYY_MM_DD_HH-mm')}.csv`
    );
    // console.log('csv:');
    // console.log(result);
    fs.writeFileSync(pathToWrite, result);
    console.log(`CSV file created at: ${pathToWrite}`);
  } catch (error) {
    console.log(error);
  } finally {
    await closeDB();
  }
};
