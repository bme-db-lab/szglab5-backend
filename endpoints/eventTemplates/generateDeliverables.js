const { getDB } = require('../../db/db');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    if (isNaN(reqId)) {
      throw new Error('Request id is invalid');
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
        eventDate.setDate(eventDate.getDate() + 10);
        await db.Deliverables.create({
          deadline: eventDate,
          EventId: event.dataValues.id,
          DeliverableTemplateId: deliverableTemplate.dataValues.id
        });
      }
    }
    res.status(201).send();
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
