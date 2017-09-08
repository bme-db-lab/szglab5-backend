const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const queryObj = {};
    if (req.query.filter && req.query.filter.search) {
      queryObj.where = {
        $or: [
          {
            loginName: {
              $like: `%${req.query.filter.search}%`
            }
          },
          {
            displayName: {
              $like: `%${req.query.filter.search}%`
            }
          },
          {
            neptun: {
              $like: `%${req.query.filter.search}%`
            }
          }
        ]
      };
    }

    if (req.query.limit) {
      queryObj.limit = parseInt(req.query.limit, 10);
    }

    if (req.query.offset) {
      queryObj.offset = parseInt(req.query.offset, 10);
    }
    queryObj.include = [{ all: true }];
    queryObj.attributes = ['id', 'loginName', 'displayName', 'email', 'subscribedToMailList', 'subscribedToEmailNotify', 'neptun', 'email_official'];

    const records = await db.Users.findAll(queryObj);
    const response = getJSONApiResponseFromRecords(db, 'Users', records, {
      includeModels: []
    });
    res.send(response);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

