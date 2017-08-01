const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecords } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
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
    console.log(JSON.stringify(queryObj));

    const db = getDB();
    db.Users.findAll(queryObj)
      .then(genJSONApiResByRecords.bind(null, db, 'Users'))
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

