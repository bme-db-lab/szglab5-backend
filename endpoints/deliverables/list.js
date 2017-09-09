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

  if ('git' in filter) {
    query.url = filter.git;
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
    query.grade = {
      $ne: null
    };
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
    const userId = userInfo ? userInfo.userId : -1;

    const db = getDB();
    let queryObj = {};
    queryObj.include = [];

    if (filter) {
      queryObj = {
        where: getQuery(filter, userId)
      };
      queryObj.include = [];
      if ('exerciseCategoryId' in filter) {
        queryObj.include.push(
          {
            model: db.Events,
            where: {},
            include: [{
              model: db.ExerciseSheets,
              where: {
                ExerciseCategoryId: filter.exerciseCategoryId
              }
            }]
          }
        );
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
      include: [{
        model: db.StudentRegistrations,
        include: [{
          model: db.Users,
        }]
      }]
    });

    if (req.query.limit) {
      queryObj.limit = parseInt(req.query.limit, 10);
    }

    if (req.query.offset) {
      queryObj.offset = parseInt(req.query.offset, 10);
    }

    const deliverables = await db.Deliverables.findAll(queryObj);

    const response = getJSONApiResponseFromRecords(db, 'Deliverables', deliverables, {
      includeModels: ['DeliverableTemplates', 'Events', 'Users', 'StudentRegistrations']
    });

    res.send(response);
    // const response = await genJSONApiResByRecords(db, 'Deliverables', deliverables);
    // response.included = [];
    // for (const deliverable of response.data) {
    //   // Included: Deliverable-Templates
    //   if (deliverable.relationships.DeliverableTemplate.data !== null) {
    //     const delTemplate = await db.DeliverableTemplates.findById(deliverable.relationships.DeliverableTemplate.data.id);
    //     response.included.push({
    //       id: delTemplate.dataValues.id,
    //       type: 'DeliverableTemplates',
    //       attributes: delTemplate.dataValues
    //     });
    //   }
    //   if (deliverable.attributes.Event &&
    //     deliverable.attributes.Event.StudentRegistration &&
    //     deliverable.attributes.Event.StudentRegistration.User) {
    //     const user = deliverable.attributes.Event.StudentRegistration.User;
    //     response.included.push({
    //       id: user.id,
    //       type: 'Users',
    //       attributes: user
    //     });
    //     deliverable.relationships.Student = {
    //       data: {
    //         id: user.id,
    //         type: 'Users'
    //       }
    //     };
    //     delete deliverable.attributes.Event;
    //   }
    // }
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};
