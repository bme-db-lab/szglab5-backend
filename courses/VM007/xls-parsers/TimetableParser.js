const logger = require('../../../utils/logger.js');
const XLSX = require('xlsx');
const { join } = require('path');

const { getDB } = require('../../../db/db.js');

module.exports = async (options) => {
  const db = getDB();
  let seed = null;
  try {
    const xlsFileName = options.xlsBeosztasFileName || 'beosztas-minta.xlsx';
    const basePath = options.basePath || 'courses/VM010/xls-data';

    const seedFile = join(basePath, xlsFileName);
    const sheetName = 'Idopontok';
    const opts = {
      sheetStubs: true
    };
    const workbook = XLSX.readFile(seedFile, opts);
    seed = workbook.Sheets[sheetName];
  } catch (err) {
    return err;
  }

  // const typeQuery = await db.ExerciseCategories.findAll();
  // const types = typeQuery.map(qResult => qResult.dataValues.type);

  const eventTemplates = await db.EventTemplates.findAll();
  const exerciseCategories = [];
  for (const eventTemplate of eventTemplates) {
    const exCat = await eventTemplate.getExerciseCategory();
    if (exCat !== null) {
      exerciseCategories.push(exCat);
    }
  }
  const types = exerciseCategories.map(qResult => qResult.dataValues.type);

  const apps = [];
  let app = { data: {} };
  if (seed !== null) {
    for (const key of Object.keys(seed)) {
      const reg = /([A-Z]+)([0-9]+)/;
      const rKey = reg.exec(key);
      if (seed[key].w !== undefined) {
        if (types.indexOf(seed[key].w) !== -1) {
          app = { data: {} };
          if (seed[(`A${rKey[2]}`)] !== undefined) {
            app.data.location = seed[(`A${rKey[2]}`)].w;
            const date = seed[(`${rKey[1]}2`)].w;
            const hour = seed[(`${rKey[1]}1`)].w;
            app.data.date = new Date(`${date}`);
            app.data.date.setHours(hour);
            const gQueryResult = await db.StudentGroups.findOne({
              attributes: ['id'],
              where: {
                name: seed[(`D${rKey[2]}`)].w
              }
            });
            app.data.StudentGroupId = gQueryResult.dataValues.id;
            apps.push(app);

            const exCat = exerciseCategories.find(category => (category.dataValues.type === seed[key].w));
            const eventTemplate = await db.EventTemplates.find({
              where: { ExerciseCategoryId: exCat.id }
            });
            app.data.EventTemplateId = eventTemplate.id;
          }
        }
      }
    }
    return apps;
  }
  logger.warn('No seed data provided');
  return null;
};
