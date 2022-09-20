const moment = require('moment');

const { getDB } = require('../../db/db');
const logger = require('../../utils/logger');
const { genErrorObj } = require('../../utils/utils.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    if (isNaN(reqId)) {
      throw new Error('Request id is invalid');
    }

    const { roles } = req.userInfo;
    if (roles.includes('STUDENT')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    const eventTemplate = await db.EventTemplates.findById(reqIdNum);
    const events = await eventTemplate.getEvents();
    const deliverableTemplates = await eventTemplate.getDeliverableTemplates();
    logger.info('Generating Deliverables!');
    for (const event of events) {
      logger.debug(`Event: loc - "${event.dataValues.location}" date - "${event.dataValues.date}"`);
      for (const deliverableTemplate of deliverableTemplates) {
        logger.debug(` DeliverableTemplate: type - "${deliverableTemplate.dataValues.type}" name - "${deliverableTemplate.dataValues.name}" desc - "${deliverableTemplate.dataValues.description}"`);
        const eventDate = event.dataValues.date;
        let deadline = moment(eventDate).add(2, 'd');
        // if (i === 0 || i === 1) {
        //   deadline = moment(eventDate).subtract(1, 'y');
        // }

        await db.Deliverables.create({
          deadline,
          EventId: event.dataValues.id,
          DeliverableTemplateId: deliverableTemplate.dataValues.id
        });
      }
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send({
      errors: [
        {
          message: err.message
        }
      ]
    });
  }
};
