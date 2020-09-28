const logger = require('../../../utils/logger.js');
const XLSX = require('xlsx');
const { join } = require('path');

const { getDB } = require('../../../db/db.js');

// https://gist.github.com/christopherscott/2782634
function getJsDateFromExcel(excelDate) {
  // JavaScript dates can be constructed by passing milliseconds
  // since the Unix epoch (January 1, 1970) example: new Date(12312512312);

  // 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug")
  // 2. Convert to milliseconds.

  return new Date((excelDate - (25567 + 2)) * 86400 * 1000);
}

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
            const hour = seed[(`${rKey[1]}1`)].w;
            app.data.date = getJsDateFromExcel(seed[(`${rKey[1]}2`)].v);
            app.data.date.setHours(hour);
            const gQueryResult = await db.StudentGroups.findOne({
              attributes: ['id'],
              where: {
                name: seed[(`D${rKey[2]}`)].w
              }
            });
            app.data.StudentGroupId = gQueryResult.dataValues.id;
            console.log('app', app);
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
