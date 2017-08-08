const auth = require('../../middlewares/auth.js');
const getSemester = require('./get.js');
const listSemester = require('./list.js');

module.exports = (app) => {
  app.use('/semesters*', auth);
  app.get('/semesters', listSemester);
  app.get('/semesters/:id', getSemester);
};
