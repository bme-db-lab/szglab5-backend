const auth = require('../../middlewares/auth.js');
const epLogger = require('../../middlewares/ep-logger');

const addDeliverable = require('./add.js');
const getDeliverables = require('./get.js');
const getDeliverableCorrector = require('./getCorrector.js');
const getDeliverableEvent = require('./getEvent.js');
const getDeliverableTemplate = require('./getTemplate.js');
const getDeliverableStudent = require('./getStudent.js');
const listDeliverables = require('./list.js');
const updateDeliverables = require('./update.js');
const updateDeliverableEvent = require('./updateEvent.js');
const uploadDeliverable = require('./upload');
const downloadDeliverable = require('./download');
const downloadWithOrigFileName = require('./downloadOrigFileName');

const multer = require('multer');

const upload = multer();

module.exports = (app) => {
  app.post('/deliverables/:id/download', downloadDeliverable);
  app.get('/deliverables/:id/download/:fileName', downloadWithOrigFileName);
  app.use('/deliverables*', auth);
  app.use('/deliverables*', epLogger);

  app.get('/deliverables/:id', getDeliverables);
  app.get('/deliverables/:id/corrector', getDeliverableCorrector);
  app.get('/deliverables/:id/event', getDeliverableEvent);
  app.get('/deliverables/:id/template', getDeliverableTemplate);
  app.get('/deliverables/:id/student', getDeliverableStudent);
  app.get('/deliverables', listDeliverables);
  app.patch('/deliverables/:id', updateDeliverables);
  app.patch('/deliverables/:id/event', updateDeliverableEvent);
  app.post('/deliverables', addDeliverable);
  app.post('/deliverables/:id/upload', upload.single('file'), uploadDeliverable);
};
