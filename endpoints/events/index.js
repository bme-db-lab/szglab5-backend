const addEvent = require('./add.js');
const getEvent = require('./get.js');
const getEventDemonstrator = require('./getDemonstrator.js');
const getExerciseSheet = require('./getExerciseSheet.js');
const generateExerciseSheet = require('./generateExerciseSheet.js');
const getExerciseType = require('./getExerciseType.js');
const updateEvent = require('./update.js');
const getStudent = require('./getStudent.js');
const listDeliverables = require('./listDeliverables.js');
const listEvents = require('./list.js');
const listStudents = require('./listStudents.js');

const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

module.exports = (app) => {
  app.use('/events*', auth);
  app.use('/events*', epLogger);

  app.get('/events/:id', getEvent);
  app.get('/events/:id/demonstrator', getEventDemonstrator);
  app.get('/events/:id/exercisesheet', getExerciseSheet);
  app.post('/events/:id/exercisesheet/generate', generateExerciseSheet);
  app.get('/events/:id/exercisetype', getExerciseType);
  app.get('/events/:id/student', getStudent);
  app.get('/events/:id/deliverables', listDeliverables);
  app.get('/events', listEvents);
  app.get('/event-students', listStudents);
  app.patch('/events/:id', updateEvent);
  app.post('/events', addEvent);
};
