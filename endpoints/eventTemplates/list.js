const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();
    const filter = req.query.filter;

    const userInfo = req.userInfo;
    // console.log(userInfo);

    const { roles } = req.userInfo;
    const isAdmin = roles.find(role => role === 'ADMIN') !== undefined;

    let demoFilter = {};
    const eventInclude = [];
    if (!isAdmin && !(filter && 'asCorrector' in filter)) {
      demoFilter = {
        DemonstratorId: userInfo.userId
      };
      eventInclude.push({
        where: demoFilter,
        model: db.Events,
        include: [
          {
            model: db.StudentRegistrations
          },
          {
            model: db.Users,
            as: 'Demonstrator'
          },
          {
            model: db.Deliverables
          },
          {
            model: db.EventTemplates
          },
          {
            model: db.ExerciseSheets
          }
        ]
      });
    }
    const records = await db.EventTemplates.findAll(
      {
        include: [
          {
            model: db.ExerciseCategories,
            include: [
              {
                model: db.ExerciseSheets
              }
            ]
          },
          {
            model: db.DeliverableTemplates
          },
          ...eventInclude
        ],
        order: ['seqNumber']
      }
    );
    const response = getJSONApiResponseFromRecords(db, 'EventTemplates', records, {
      includeModels: ['DeliverableTemplates', 'ExerciseCategories', 'ExerciseSheets']
    });
    res.send(response);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};
