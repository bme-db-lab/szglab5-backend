const { isDate } = require('lodash');
const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');


function getQuery(filter, userId) {
  const query = {};

  if ('template' in filter) {
    query.DeliverableTemplateId = filter.template;
  }

  if ('grade' in filter) {
    query.grade = filter.grade;
  }

  if ('isCorrector' in filter) {
    query.CorrectorId = userId;
  }

  if ('finalized' in filter) {
    if (filter.finalized === 'true') {
      query.finalized = true;
    } else if (filter.finalized === 'false') {
      query.finalized = false;
    }
  }

  if ('hasGrade' in filter) {
    if (filter.hasGrade === 'true') {
      query.grade = {
        $ne: null
      };
    } else if (filter.hasGrade === 'false') {
      query.grade = null;
    }
  }

  if ('isFree' in filter) {
    if (filter.isFree === 'true') {
      query.CorrectorId = null;
    } else if (filter.isFree === 'false') {
      query.CorrectorId = {
        $ne: null
      };
    }
  }

  if ('isOver' in filter && filter.isOver === 'true') {
    query.deadline = {
      $lt: new Date()
    };
  }

  if ('deadlinestart' in filter && 'deadlineend' in filter) {
    const startDate = new Date(filter.deadlinestart);
    const endDate = new Date(filter.deadlineend);
    if (isDate(startDate) && isDate(endDate)) {
      query.deadline = {
        $between: [startDate, endDate]
      };
    }
  }
  return query;
}

module.exports = async (req, res) => {
  try {
    const filter = req.query.filter;

    const userInfo = req.userInfo;
    const { roles } = req.userInfo;

    if (roles.includes('STUDENT')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    const userId = userInfo ? userInfo.userId : -1;

    const db = getDB();
    let queryObj = {};
    queryObj.include = [];

    let userExTypeIds = [];

    if (filter) {
      queryObj = {
        where: getQuery(filter, userId)
      };
      queryObj.include = [];

      if ('isAttached' in filter) {
        const user = await db.Users.findById(userId);
        if (user) {
          const exerciseTypes = await user.getExerciseTypes();
          userExTypeIds = exerciseTypes.map(exType => exType.id);
        }
      }
    }

    if (filter && 'deliverableTemplateId' in filter) {
      queryObj.include.push({
        where: {
          id: filter.deliverableTemplateId
        },
        model: db.DeliverableTemplates,
      });
    } else if (filter && 'isFile' in filter && filter.isFile === 'true') {
      queryObj.include.push({
        where: {
          type: 'FILE'
        },
        model: db.DeliverableTemplates,
      });
    } else {
      queryObj.include.push({
        model: db.DeliverableTemplates,
      });
    }

    queryObj.include.push({
      model: db.Events,
      where: (filter && 'eventTemplateId' in filter) ? {
        EventTemplateId: filter.eventTemplateId
      } : {},
      include: [
        {
          model: db.StudentRegistrations,
          include: [{ model: db.Users, }]
        },
        {
          model: db.EventTemplates
        },
        {
          model: db.ExerciseSheets,
          where: {
            $and: [
              (filter && 'exerciseCategoryId' in filter) ? {
                ExerciseCategoryId: filter.exerciseCategoryId
              } : {},
              (filter && 'isAttached' in filter) ? {
                ExerciseTypeId: {
                  $in: userExTypeIds
                }
              } : {},
            ]
          },
          include: [
            {
              model: db.ExerciseTypes
            }
          ]
        }
      ]
    });

    queryObj.include.push({
      model: db.Users,
      as: 'Corrector',
      attributes: ['id', 'displayName', 'email_official', 'email']
    });

    // console.log(JSON.stringify(queryObj));

    if (req.query.limit) {
      queryObj.limit = parseInt(req.query.limit, 10);
    }

    if (req.query.offset) {
      queryObj.offset = parseInt(req.query.offset, 10);
    }

    const deliverables = await db.Deliverables.findAll(queryObj);

    const response = getJSONApiResponseFromRecords(db, 'Deliverables', deliverables, {
      includeModels: ['DeliverableTemplates', 'Events', 'Users', 'StudentRegistrations', 'ExerciseTypes', 'ExerciseSheets']
    });

    res.send(response);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};
