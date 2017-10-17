const { isDate } = require('lodash');
const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');
const { orderBy } = require('lodash');

function getQuery(filter) {
  const query = {};

  if ('location' in filter) {
    query.location = filter.location;
  }

  if ('student' in filter) {
    query.StudentRegistrationId = filter.student;
  }

  if ('demonstrator' in filter) {
    query.DemonstratorEmail = filter.demonstrator;
  }

  if ('exerciseSheetId' in filter) {
    query.ExerciseSheetId = filter.exerciseSheetId;
  }

  if ('datestart' in filter && 'dateend' in filter) {
    const startDate = new Date(filter.datestart);
    const endDate = new Date(filter.dateend);
    if (isDate(startDate) && isDate(endDate)) {
      query.date = {
        $between: [startDate, endDate]
      };
    }
  }
  return query;
}

// function getIncludes(filter, db) {
//   const includes = [];
//   if ('exercisecat' in filter) {
//     includes.push({
//       model: db.ExerciseSheets,
//       where: {},
//       include: {
//         model: db.ExerciseCategories,
//         where: {
//           type: filter.exercisecat
//         }
//       }
//     });
//   }

//   return includes;
// }

module.exports = async (req, res) => {
  try {
    const { roles } = req.userInfo;

    if (roles.includes('STUDENT')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    const filter = req.query.filter;
    const db = getDB();
    let queryObj = {};
    if (filter) {
      queryObj = {
        where: getQuery(filter)
      };
    }

    let exCat = {};
    if (filter && 'exercisecat' in filter) {
      exCat = {
        type: filter.exercisecat
      };
    }

    let eventTempl = {};
    let demonstratorId = {};
    if (filter && 'eventTemplateId' in filter) {
      eventTempl = {
        id: filter.eventTemplateId
      };

      const { userId } = req.userInfo;

      demonstratorId = {
        id: userId
      };
    }

    queryObj.include = [
      {
        model: db.Deliverables,
        include: [
          {
            model: db.DeliverableTemplates
          },
          {
            model: db.Users,
            as: 'Corrector',
            attributes: ['id', 'displayName', 'email_official', 'email']
          }
        ]
      },
      {
        model: db.ExerciseSheets,
        include: [
          {
            model: db.ExerciseCategories,
            where: exCat
          },
          {
            model: db.ExerciseTypes
          }
        ]
      },
      {
        model: db.EventTemplates,
        where: eventTempl
      },
      {
        model: db.Users,
        as: 'Demonstrator',
        where: demonstratorId
      },
      {
        model: db.StudentRegistrations,
        include: {
          model: db.Users
        }
      }
    ];


    const events = await db.Events.findAll(queryObj);

    events.forEach((event) => {
      const sortedDeliverables = orderBy(event.dataValues.Deliverables, ['DeliverableTemplate.name'], ['asc']);
      event.dataValues.Deliverables = sortedDeliverables;
    });

    const includeModels = ['Deliverables', 'ExerciseSheets', 'Users', 'DeliverableTemplates', 'ExerciseCategories'];
    if (filter && 'eventTemplateId' in filter) {
      includeModels.push('ExerciseTypes');
      includeModels.push('StudentRegistrations');
    }

    const response = getJSONApiResponseFromRecords(db, 'Events', events, {
      includeModels
    });
    res.send(response);
  } catch (err) {
    // console.log(err.stack);
    res.status(500).send(genErrorObj(err.message));
  }
};

/**
 * @api {get} /events List Events
 * @apiName List
 * @apiGroup Events
 * @apiDescription List events
 *
 * @apiParam {String} [filter] filter the events
 *
 * @apiExample {js} Example filter to location:
 * /events?filter[location]=IL105
 *
 * @apiExample {js} Example filter to date:
 * /events?filter[datestart]=2017-04-1&filter[dateend]=2018-01-11
 *
 * @apiExample {js} Example filter to exercise category:
 * /events?filter[exercisecat]=SQL
 *
 */
