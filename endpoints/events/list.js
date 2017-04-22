const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');
const { isDate } = require('lodash');

function getQuery(filter) {
  const query = {};
  if ('location' in filter) {
    query.location = filter.location;
  }
  if ('dlstart' in filter && 'dlend' in filter) {
    const startDate = new Date(filter.dlstart);
    const endDate = new Date(filter.dlend);
    console.log(startDate);
    console.log(endDate);
    if (isDate(startDate) && isDate(endDate)) {
      query.date = {
        $between: [startDate, endDate]
      };
    }
  }

  return query;
}

module.exports = (req, res) => {
  try {
    const filter = req.query.filter;
    console.log('filter', filter);

    const db = getDB();
    db.Events.findAll({ where: getQuery(filter) })
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
 * @apiSampleRequest /events?filter[location]=IL105
 * @apiSampleRequest /events?filter[dlstart]=2017-04-1&filter[dlend]=2018-01-11
 *
 */
