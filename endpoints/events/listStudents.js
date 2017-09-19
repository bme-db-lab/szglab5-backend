const { isDate } = require('lodash');
const async = require('async');
const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecord, genJSONApiResByRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    throw new Error('Not implemented exception!');
    const filter = req.query.filter;

    let queryObj = {};
    if ('location' in filter && 'date' in filter) {
      queryObj.location = filter.location;
      queryObj.date = filter.date;
    } else {
      res.status(404).send();
      return;
    }
    const db = getDB();
    db.Events.findAll({ where: queryObj })
      .then(genJSONApiResByRecords.bind(null, db, 'Events'))
      .then((response) => {
        if (response === null) {
          res.status(404).send();
          return;
        }
        var ids = [];
        for (var i = 0, len = response.data.length; i < len; ++i)
          ids.push(response.data[i].relationships.StudentRegistration.data.id);
        db.StudentRegistrations.findAll({ where: { id: ids } })
          .then(genJSONApiResByRecords.bind(null, db, 'StudentRegistrations'))
          .then((responseUsers) => {
            var userIds = [];
            for (var i = 0, len = responseUsers.data.length; i < len; ++i)
              userIds.push(responseUsers.data[i].relationships.User.data.id);
            db.Users.findAll({ where: { id: userIds } })
              .then(genJSONApiResByRecords.bind(null, db, 'Users'))
              .then((responseUserData) => {
                res.send(responseUserData);
              });
          });
      })
      .catch((err) => {
        res.status(500).send(genErrorObj(err.message));
      });
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

/**
 * @api {get} /events/students List Students for an Event
 * @apiName List
 * @apiGroup Events
 * @apiDescription List students for an event
 *
 * @apiParam {String} [filter] filter the events
 *
 * @apiExample {js} Example filter to location:
 * /events?filter[location]=IL105
 *
 * @apiExample {js} Example filter to date:
 * /events?filter[date]=2017-04-1
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "type": "Users",
 *       "attributes": {
 *         "displayName": "Student Sarolta",
 *         "loginName": "student",
 *         "email": "student.email@cool-emailprovider.com",
 *         "sshPublicKey": null,
 *         "colorTheme": "blue-gray",
 *         "role": "STUDENT",
 *         "neptun": "Q87XXZ",
 *         "university": null,
 *         "email_official": null,
 *         "mobile": null,
 *         "title": null,
 *         "printSupport": null,
 *         "studentgroup_id": null,
 *         "classroom": null,
 *         "spec": null,
 *         "exercises": null,
 *         "ownedExerciseID": null,
 *         "createdAt": "2017-05-08T19:12:56.366Z",
 *         "updatedAt": "2017-05-08T19:12:56.366Z"
 *       },
 *       "relationships": {
 *         "StudentRegistrations": {
 *           "data": [
 *             {
 *               "id": 1,
 *               "type": "StudentRegistrations"
 *             }
 *           ]
 *         },
 *         "Deliverables": {
 *           "data": []
 *         }
 *       }
 *     }
 *   ]
 * }
 */
