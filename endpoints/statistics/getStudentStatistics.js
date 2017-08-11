const { getDB } = require('../../db/db.js');

// http://expressjs.com/en/api.html#req.query
module.exports = (req, res) => {
  const db = getDB();
  console.log(req.query);
  res.send({
    events: [
      {
        grade: 2
      },
      {
        grade: 4
      }
    ]
  });
};
