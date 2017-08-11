const { getDB } = require('../../db/db.js');

// http://expressjs.com/en/api.html#req.query
// GET localhost:7000/statistics/group?studentId=2
module.exports = (req, res) => {
  const db = getDB();
  console.log(req.query);
  res.send({
    students: [
      {
        id: 121,
        neptun: 'AXSASAD',
        events: [
          {
            grade: 3
          },
          {
            grade: 2
          }
        ]
      },
      {
        id: 121,
        neptun: 'AXSASAD',
        events: [
          {
            grade: 3
          },
          {
            grade: 2
          }
        ]
      },
    ]
  });
};
