const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('../../utils/utils.js');
const { orderBy } = require('lodash');
const moment = require('moment');

module.exports = async (req, res) => {
  try {
    const db = getDB();
    const { eventTemplateId, asCorrector, exerciseTypeId } = req.query;

    const userInfo = req.userInfo;
    const { roles } = req.userInfo;

    // only ADMIN DEMONSTRATOR CORRECTOR
    if (!roles.includes('ADMIN') && !roles.includes('DEMONSTRATOR') && !roles.includes('CORRECTOR')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    if (!eventTemplateId || !(asCorrector || exerciseTypeId)) {
      throw new Error('Required query parameteres: "(eventTemplateId) && (exerciseTypeId || asCorrector)"');
    }

    let userExTypeIds = [];

    const userId = userInfo ? userInfo.userId : -1;
    if (asCorrector) {
      const user = await db.Users.findById(userId);
      if (user) {
        const exerciseTypes = await user.getExerciseTypes();
        userExTypeIds = exerciseTypes.map(exType => exType.id);
      }
    }

    const deliverables = await db.Deliverables.findAll({
      include: [
        {
          model: db.Events,
          attributes: ['id'],
          where: { EventTemplateId: eventTemplateId },
          include: [
            {
              model: db.StudentRegistrations,
              attributes: ['id'],
              where: {},
              include: {
                model: db.Users,
                attributes: ['id', 'displayName', 'neptun']
              }
            },
            {
              model: db.ExerciseSheets,
              attributes: ['id'],
              where: {},
              include: [
                {
                  model: db.ExerciseTypes,
                  attributes: ['id', 'shortName'],
                  where: {
                    $and: [
                      (asCorrector) ? {
                        id: {
                          $in: userExTypeIds
                        }
                      } : {},
                      (exerciseTypeId) ? {
                        id: parseInt(exerciseTypeId, 10)
                      } : {}
                    ]
                  }
                },
                {
                  model: db.ExerciseCategories,
                  attributes: ['id', 'type'],
                }
              ]
            }
          ]
        },
        {
          model: db.Users,
          attributes: ['id', 'displayName'],
          as: 'Corrector'
        },
        {
          model: db.DeliverableTemplates,
          attributes: ['id', 'description'],
          where: {
            type: 'FILE'
          }
        }
      ]
    });
    const data = deliverables.map((deliverable) => {
      let elapsedTime = 'Not uploaded';
      if (deliverable.uploaded) {
        const diffHours = moment().diff(deliverable.lastSubmittedDate, 'hours');
        const diffDays = Math.floor(diffHours / 24);

        const hoursStr = diffHours % 24 !== 0 ? `${diffHours % 24} hours` : '';
        const daysStr = diffDays !== 0 ? `${diffDays} days` : '';

        elapsedTime = `${daysStr} ${hoursStr}`;
      }
      return {
        id: deliverable.id,
        name: deliverable.Event.StudentRegistration.User.displayName,
        neptun: deliverable.Event.StudentRegistration.User.neptun,
        exercise: deliverable.Event.ExerciseSheet.ExerciseType.shortName,
        labor: deliverable.Event.ExerciseSheet.ExerciseCategory.type,
        file: deliverable.id,
        description: deliverable.DeliverableTemplate.description,
        deadline: deliverable.deadline,
        submittedDate: deliverable.lastSubmittedDate,
        elapsedTime,
        grade: deliverable.grade,
        imsc: deliverable.imsc,
        finalized: deliverable.finalized,
        corrector: (deliverable.Corrector) ? deliverable.Corrector.displayName : '_Free'
      };
    });
    const sortedData = orderBy(data, ['corrector', 'submittedDate'], [true, false]);

    const table = {
      headers: ['name', 'neptun', 'description', 'elapsedTime', 'grade', 'imsc', 'finalized', 'corrector'],
      data: sortedData,
      meta: {
        count: deliverables.length
      }
    };
    res.send(table);
  } catch (error) {
    res.status(500).send(genErrorObj(error.message));
  }
};
