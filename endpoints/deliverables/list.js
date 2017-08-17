const { isDate } = require('lodash');
const async = require('async');
const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords } = require('../../utils/jsonapi.js');
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
    query.finalized = filter.finalized;
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
    console.log(userId);

    const db = getDB();
    let queryObj = {};
    if (filter) {
      queryObj = {
        where: getQuery(filter, userId)
      };

      if ('isCorrector' in filter) {
        queryObj.include = [
          {
            model: db.Events,
            where: {},
            include: [{
              model: db.StudentRegistrations,
              where: {},
              include: [{
                model: db.Users,
                where: {}
              }]
            }]
          }
        ];
      }
    }
    const deliverables = await db.Deliverables.findAll(queryObj);
    const response = await genJSONApiResByRecords(db, 'Deliverables', deliverables);
    response.included = [];
    for (const deliverable of response.data) {
      // Included: Deliverable-Templates
      if (deliverable.relationships.DeliverableTemplate.data !== null) {
        const delTemplate = await db.DeliverableTemplates.findById(deliverable.relationships.DeliverableTemplate.data.id);
        response.included.push({
          id: delTemplate.dataValues.id,
          type: 'DeliverableTemplates',
          attributes: delTemplate.dataValues
        });
      }
      if (deliverable.attributes.Event &&
        deliverable.attributes.Event.StudentRegistration &&
        deliverable.attributes.Event.StudentRegistration.User) {
        const user = deliverable.attributes.Event.StudentRegistration.User;
        response.included.push({
          id: user.id,
          type: 'Users',
          attributes: user
        });
        deliverable.relationships.Student = {
          id: user.id,
          type: 'Users'
        };
        delete deliverable.attributes.Event;
      }
    }

    res.send(response);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

/**
 * @api {get} /deliverables List Deliverables
 * @apiName List
 * @apiGroup Deliverables
 * @apiDescription List deliverables
 *
 * @apiParam {String} [filter] filter the deliverables
 *
 * @apiExample {js} Example filter for template:
 * /deliverables?filter[template]=1
 *
 * @apiExample {js} Example filter for grade:
 * /deliverables?filter[grade]=5
 *
 * @apiExample {js} Example filter for git repository:
 * /deliverables?filter[git]=http://gitlab.com/super_repo/
 *
 * @apiExample {js} Example filter for deadline:
 * /deliverables?filter[deadlinestart]=2016-09-20&filter[deadlineend]=2016-09-30
 *
 * @apiSuccessExample Success-Response:
 * {
 *     "data": [
 *         {
 *             "id": 4,
 *             "type": "Deliverables",
 *             "attributes": {
 *                 "deadline": "2017-09-27T00:00:00.000Z",
 *                 "submitteddate": "2017-09-30T00:00:00.000Z",
 *                 "grade": null,
 *                 "imsc": 0,
 *                 "finalized": false,
 *                 "comment": null,
 *                 "url": null,
 *                 "commit": null,
 *                 "createdAt": "2017-07-12T15:29:44.063Z",
 *                 "updatedAt": "2017-07-12T15:29:44.063Z",
 *                 "EventId": 2,
 *                 "DeliverableTemplateId": 1,
 *                 "CorrectorName": null,
 *                 "DeputyEmail": null,
 *                 "CorrectorEmail": null
 *             },
 *             "relationships": {
 *                 "Event": {
 *                     "data": {
 *                         "id": 2,
 *                         "type": "Events"
 *                     }
 *                 },
 *                 "DeliverableTemplate": {
 *                     "data": {
 *                         "id": 1,
 *                         "type": "DeliverableTemplates"
 *                     }
 *                 },
 *                 "Corrector": {
 *                     "data": {
 *                         "id": 2,
 *                         "type": "Users"
 *                     }
 *                 },
 *                 "Deputy": {
 *                     "data": {
 *                         "id": 2,
 *                         "type": "Users"
 *                     }
 *                 }
 *             }
 *         },
 *         {
 *             "id": 7,
 *             "type": "Deliverables",
 *             "attributes": {
 *                 "deadline": "2016-02-27T00:00:00.000Z",
 *                 "submitteddate": "2016-02-22T00:00:00.000Z",
 *                 "grade": 3,
 *                 "imsc": 0,
 *                 "finalized": false,
 *                 "comment": null,
 *                 "url": null,
 *                 "commit": null,
 *                 "createdAt": "2017-07-12T15:29:44.079Z",
 *                 "updatedAt": "2017-07-12T15:29:44.079Z",
 *                 "EventId": 3,
 *                 "DeliverableTemplateId": 1,
 *                 "CorrectorName": null,
 *                 "DeputyEmail": null,
 *                 "CorrectorEmail": null
 *             },
 *             "relationships": {
 *                 "Event": {
 *                     "data": {
 *                         "id": 3,
 *                         "type": "Events"
 *                     }
 *                 },
 *                 "DeliverableTemplate": {
 *                     "data": {
 *                         "id": 1,
 *                         "type": "DeliverableTemplates"
 *                     }
 *                 },
 *                 "Corrector": {
 *                     "data": {
 *                         "id": 2,
 *                         "type": "Users"
 *                     }
 *                 },
 *                 "Deputy": {
 *                     "data": {
 *                         "id": 2,
 *                         "type": "Users"
 *                     }
 *                 }
 *             }
 *         },
 *         {
 *             "id": 1,
 *             "type": "Deliverables",
 *             "attributes": {
 *                 "deadline": "2017-09-12T00:00:00.000Z",
 *                 "submitteddate": "2017-09-12T00:00:00.000Z",
 *                 "grade": 2,
 *                 "imsc": 0,
 *                 "finalized": false,
 *                 "comment": "Lol pont átment.",
 *                 "url": null,
 *                 "commit": null,
 *                 "createdAt": "2017-07-12T15:18:14.273Z",
 *                 "updatedAt": "2017-07-12T15:30:13.247Z",
 *                 "EventId": 1,
 *                 "DeliverableTemplateId": 1,
 *                 "CorrectorName": null,
 *                 "DeputyEmail": "demonstrator@db.bme.hu",
 *                 "CorrectorEmail": null
 *             },
 *             "relationships": {
 *                 "Event": {
 *                     "data": {
 *                         "id": 1,
 *                         "type": "Events"
 *                     }
 *                 },
 *                 "DeliverableTemplate": {
 *                     "data": {
 *                         "id": 1,
 *                         "type": "DeliverableTemplates"
 *                     }
 *                 },
 *                 "Corrector": {
 *                     "data": {
 *                         "id": 2,
 *                         "type": "Users"
 *                     }
 *                 },
 *                 "Deputy": {
 *                     "data": {
 *                         "id": 3,
 *                         "type": "Users"
 *                     }
 *                 }
 *             }
 *         }
 *     ]
 * }
 */
