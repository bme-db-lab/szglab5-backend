const getEvents = require('./get.js');
const getEventDemonstrator = require('./getDemonstrator.js');
const getExerciseSheet = require('./getExerciseSheet.js');
const getExerciseType = require('./getExerciseType.js');
const getStudent = require('./getStudent.js');
const listEvents = require('./list.js');

module.exports = (app) => {
  app.get('/events/:id', getEvents);
  app.get('/events/:id/demonstrator', getEventDemonstrator);
  app.get('/events/:id/exercisesheet', getExerciseSheet);
  app.get('/events/:id/exercisetype', getExerciseType);
  app.get('/events/:id/student', getStudent);
  app.get('/events', listEvents);
};
