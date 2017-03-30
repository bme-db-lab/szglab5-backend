const getUser = require('./get.js');

module.exports = (app) => {
  app.get('/users/:id', getUser);
};
