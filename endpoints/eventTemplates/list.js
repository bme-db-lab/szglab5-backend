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
    // console.log(0);
    // console.log(filter);
    // console.log(isAdmin);
    // console.log(!(filter && 'asCorrector' in filter));
    if (!isAdmin && !(filter && 'asCorrector' in filter)) {
      // console.log('1');
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
    } else {

    }

    const records = await db.EventTemplates.findAll({
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
      ]
    });
    const response = getJSONApiResponseFromRecords(db, 'EventTemplates', records, {
      includeModels: ['DeliverableTemplates', 'ExerciseCategories', 'ExerciseSheets']
    });
    res.send(response);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

