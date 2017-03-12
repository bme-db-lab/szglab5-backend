const questionTypeList = require('./list.js');

module.exports = (app) => {
  app.get('/questiontypes', questionTypeList);
};
