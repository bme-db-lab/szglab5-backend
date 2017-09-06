const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();
    if (req.authStatus === 'UNAUTH') {
      // unauthenticated
      const records = await db.News.findAll({
        where: {
          onLogin: true
        },
        include: [{ all: true }]
      });
      const response = getJSONApiResponseFromRecords(db, 'News', records, {
        includeModels: []
      });
      res.send(response);
    } else {
      // authenticated
      console.log('hellos');
      console.log(req.userInfo);
      const { roles } = req.userInfo;
      const isAdmin = roles.find(role => role === 'ADMIN') !== undefined;
      const isStudent = roles.find(role => role === 'STUDENT') !== undefined;
      const isEvaluator = roles.find(role => role === 'CORRECTOR') !== undefined;
      const isDemonstrator = roles.find(role => role === 'DEMONSTRATOR') !== undefined;

      // admin should see all news
      // else if (isAdmin) {
      //   records = await db.News.findAll({
      //     where: { admins: isAdmin },
      //     include: [{ all: true }]
      //   });

      let records;
      if (isStudent) {
        records = await db.News.findAll({
          where: { students: isStudent },
          include: [{ all: true }],
        });
      } else if (isEvaluator) {
        records = await db.News.findAll({
          where: { evaluators: isEvaluator },
          include: [{ all: true }]
        });
      } else if (isDemonstrator) {
        records = await db.News.findAll({
          where: { demonstrators: isDemonstrator },
          include: [{ all: true }]
        });
      }
      const response = getJSONApiResponseFromRecords(db, 'News', records, {
        includeModels: []
      });
      res.send(response);
    }
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

