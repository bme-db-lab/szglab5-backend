const auth = require('../../middlewares/auth.js');
const getAppointment = require('./get.js');
const listAppointments = require('./list.js');

module.exports = (app) => {
  app.use('/appointments*', auth);
  app.get('/appointments', listAppointments);
  app.get('/appointments/:id', getAppointment);
};
