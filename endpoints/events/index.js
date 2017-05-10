const getEvent = require('./get.js');
const getEventDemonstrator = require('./getDemonstrator.js');
const getExerciseSheet = require('./getExerciseSheet.js');
const getExerciseType = require('./getExerciseType.js');
const getStudent = require('./getStudent.js');
const listDeliverables = require('./listDeliverables.js');
const listEvents = require('./list.js');
const listStudents = require('./listStudents.js');
const updateEvent = require('./update.js');

module.exports = (app) => {
  app.get('/events/:id', getEvent);
  app.get('/events/:id/demonstrator', getEventDemonstrator);
  app.get('/events/:id/exercisesheet', getExerciseSheet);
  app.get('/events/:id/exercisetype', getExerciseType);
  app.get('/events/:id/student', getStudent);
  app.get('/events/:id/deliverables', listDeliverables);
  app.get('/events', listEvents);
  app.get('/event-students', listStudents);
  app.patch('/events/:id', updateEvent);
};
