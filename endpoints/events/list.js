const { isDate } = require('lodash');
const async = require('async');
const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

function getQuery(filter) {
  const query = {};

  if ('location' in filter)
    query.location = filter.location;

  if ('student' in filter)
    query.StudentRegistrationId = filter.student;

  if ('demonstrator' in filter)
    query.DemonstratorEmail = filter.demonstrator;

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

function getIncludes(filter, db) {
  const includes = [];
  if ('exercisecat' in filter) {
    includes.push({
      model: db.ExerciseSheets,
      where: {},
      include: {
        model: db.ExerciseCategories,
        where: {
          type: filter.exercisecat
        }
      }
    });
  }

  return includes;
}

module.exports = (req, res) => {
  try {
    const filter = req.query.filter;

    const db = getDB();
    let queryObj = {};
    if (filter) {
      queryObj = {
        where: getQuery(filter),
        include: getIncludes(filter, db)
      };
    }

    db.Events.findAll(queryObj)
      .then(genJSONApiResByRecords.bind(null, db, 'Events'))
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.status(500).send(genErrorObj(err.message));
      });
  } catch (err) {
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
