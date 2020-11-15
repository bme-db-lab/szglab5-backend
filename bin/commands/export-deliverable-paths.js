const { initDB, closeDB } = require('../../db/db.js');
const json2csv = require('json2csv');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const moment = require('moment');

module.exports = async () => {
  try {
    const db = await initDB();

    const eventTemplates = await db.EventTemplates.findAll({
      include: {
        where: {},
        model: db.ExerciseCategories,
      },
    });
    const eventTemplatesChoices = eventTemplates.map((et) => ({
      name: `${et.ExerciseCategory.type} - ${et.type}`,
      value: et.id,
    }));

    const prompt = await inquirer.prompt([
      {
        type: 'list',
        choices: eventTemplatesChoices,
        message: 'event template to export',
        name: 'eventTemplateId',
      },
    ]);

    const deliverables = await db.Deliverables.findAll({
      where: {
        filePath: {
          $ne: null,
        },
      },
      include: [
        {
          model: db.DeliverableTemplates,
          where: {},
        },
        {
          model: db.Events,
          where: {},
          include: [
            {
              model: db.EventTemplates,
              where: {
                id: prompt.eventTemplateId,
              },
            },
            {
              model: db.StudentRegistrations,
              where: {},
              include: {
                model: db.Users,
                where: {},
              },
            },
            {
              model: db.ExerciseSheets,
              where: {},
              include: {
                model: db.ExerciseTypes,
                where: {},
              },
            },
          ],
        },
      ],
    });

    console.log(`Deliverables length: ${deliverables.length}`);
    const exportDeliverables = deliverables.map((deliverable) => {
      const momentDate = moment(deliverable.lastSubmittedDate);

      return {
        neptun: deliverable.Event.StudentRegistration.User.neptun,
        exercise_id: deliverable.Event.ExerciseSheet.ExerciseType.exerciseId,
        task: deliverable.DeliverableTemplate.name,
        path: deliverable.filePath,
        filename: path.basename(deliverable.filePath),
        upload_date: momentDate.format('YYYY-MM-DD'),
        upload_time: momentDate.format('HH:mm:ss')
      };
    });
    const fields = [
      'neptun',
      'exercise_id',
      'task',
      'path',
      'filename',
      'upload_date',
      'upload_time'
    ];
    const csv = json2csv({ data: exportDeliverables, fields });

    const eventTemplate = await db.EventTemplates.find({
      include: {
        where: { id: prompt.eventTemplateId },
        model: db.ExerciseCategories,
      },
    });
    const pathToWrite = path.join(
      __dirname,
      'data',
      `deliverable-export-${
        eventTemplate.ExerciseCategory.type
      }-${Date.now()}.csv`
    );
    fs.writeFileSync(pathToWrite, csv);
    console.log(`CSV file created at: ${pathToWrite}`);
  } catch (err) {
    console.log(err);
  } finally {
    await closeDB();
  }
};
