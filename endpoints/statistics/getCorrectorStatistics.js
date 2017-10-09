const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('../../utils/utils.js');

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

    const correctors = await db.Users.findAll({
      include: [
        {
          model: db.Roles,
          where: {
            name: 'CORRECTOR'
          }
        },
        {
          model: db.Deliverables,
          // where: {},
          include: [
            {
              model: db.DeliverableTemplates,
              where: { type: 'FILE' }
            },
            {
              model: db.Events,
              attributes: ['id'],
              include: {
                model: db.EventTemplates,
                include: {
                  model: db.ExerciseCategories
                }
              }
            }
          ]
        },
        {
          model: db.ExerciseTypes
        }
      ]
    });

    const correctorStat = [];
    correctors.forEach((corrector) => {
      const exCatStat = {};
      let sum = 0;
      exerciseCategoryNames.forEach((exCatName) => {
        exCatStat[exCatName] = 0;
      });


      corrector.Deliverables.forEach((deliverable) => {
        const delExCatType = deliverable.Event.EventTemplate.ExerciseCategory.type;
        exCatStat[delExCatType] += 1;
        sum += 1;
      });

      const exTypes = corrector.ExerciseTypes.map(exType => exType.shortName);
      let exTypesString = '';
      exTypes.forEach((exType) => {
        exTypesString += `${exType} `;
      });

      correctorStat.push(
        Object.assign({
          displayName: corrector.displayName,
          exerciseType: exTypesString.trim(),
        }, exCatStat, { sum })
      );
    });

    correctorStat.sort((corrector1, corrector2) => {
      if (corrector1.exerciseType > corrector2.exerciseType) {
        return 1;
      } else {
        return -1;
      }
    });

    const table = {
      headers: ['displayName', 'exerciseType', ...exerciseCategoryNames, 'sum'],
      data: correctorStat
    };

    res.send(table);
  } catch (error) {
    res.status(500).send(genErrorObj(error.message));
  }
};
