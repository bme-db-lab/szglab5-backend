const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

const getAppointment = require('./get.js');
const listAppointments = require('./list.js');

module.exports = (app) => {
  app.use('/appointments*', auth);
  app.use('/appointments*', epLogger);

  app.get('/appointments', listAppointments);
  app.get('/appointments/:id', getAppointment);
};
