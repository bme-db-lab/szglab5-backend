const auth = require('../../middlewares/auth.js');
const getSemester = require('./get.js');
const listSemester = require('./list.js');

module.exports = (app) => {
  app.use('/semester*', auth);
  app.get('/semester', listSemester);
  app.get('/semester/:id', getSemester);
};
