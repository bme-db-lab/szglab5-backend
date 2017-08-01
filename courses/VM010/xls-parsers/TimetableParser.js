const logger = require('../../../utils/logger.js');
const XLSX = require('xlsx');

module.exports = () => {
  let seed = null;
  try {
    const seedFile = 'courses/VM010/xls-data/beosztas-minta.xlsx';
    const sheetName = 'Idopontok';
    const opts = {
      sheetStubs: true,
    };
    const workbook = XLSX.readFile(seedFile, opts);
    seed = workbook.Sheets[sheetName];
  } catch (err) {
    return err;
  }

  const apps = [];
  let app = { data: {} };
  if (seed !== null) {
    Object.keys(seed).some(
    (key) => {
      const reg = /([A-Z]+)([0-9]+)/;
      const rKey = reg.exec(key);
      if (seed[key].w !== undefined) {
        const types = ['OR', 'SQ', 'JD', 'SO', 'XS'];
        const year = '2017';
        if (types.indexOf(seed[key].w) !== -1) {
          app = { data: {} };
          if (seed[(`A${rKey[2]}`)] !== undefined) {
            app.data.location = seed[(`A${rKey[2]}`)].w;
            app.data.type = seed[key].w;
            const date = seed[(`${rKey[1]}2`)].w;
            const hour = seed[(`${rKey[1]}1`)].w;
            app.data.date = new Date(`${date} ${year}`);
            app.data.date.setHours(hour);
            app.data.StudentGroupName = seed[(`D${rKey[2]}`)].w;
            app.data.EventTemplateId = 1;
            apps.push(app);
          }
        }
      }
      return null;
    });
    return apps;
  }
  logger.warn('No seed data provided');
  return null;
};
