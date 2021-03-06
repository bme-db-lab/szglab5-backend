const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');
const { orderBy } = require('lodash');
const { sheetAvailable } = require('../../utils/generateSheet');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    const db = getDB();

    const { roles, userId } = req.userInfo;

    if (roles.includes('STUDENT')) {
      const events = await db.Events.findAll({
        include: {
          attributes: ['id'],
          model: db.StudentRegistrations,
          where: { UserId: userId }
        },
        attributes: ['id']
      });
      const eventIds = events.map(event => event.id);
      if (!eventIds.includes(reqIdNum)) {
        res.status(403).send(genErrorObj('Unathorized'));
        return;
      }
    }

    const event = await db.Events.findById(
      reqIdNum,
      // { include: [{ all: true }] }
      {
        include: [
          {
            model: db.ExerciseSheets,
            include: [
              {
                model: db.ExerciseCategories
              },
              {
                model: db.ExerciseTypes
              }
            ]
          },
          {
            model: db.StudentRegistrations,
            include: {
              model: db.Users
            }
          },
          {
            model: db.Users,
            as: 'Demonstrator',
            attributes: ['id', 'displayName', 'email_official', 'email']
          },
          {
            model: db.Deliverables,
            include: [
              {
                model: db.DeliverableTemplates
              },
              {
                model: db.Users,
                as: 'Corrector',
                attributes: ['id', 'displayName', 'email_official']
              }
            ]
          },
          {
            model: db.EventTemplates,
            include: {
              model: db.ExerciseCategories
            }
          }
        ]
      }
    );
    checkIfExist(event);

    const sortedDeliverables = orderBy(event.dataValues.Deliverables, ['DeliverableTemplate.name'], ['asc']);
    event.dataValues.Deliverables = sortedDeliverables;

    const response = getJSONApiResponseFromRecord(db, 'Events', event, {
      includeModels: ['Users', 'ExerciseSheets', 'Deliverables', 'EventTemplates', 'DeliverableTemplates', 'ExerciseCategories']
    });

    const handoutBaseName = sheetAvailable(event);
    if (handoutBaseName) {
      // add url for download handout
      response.data.attributes.handoutUrl = `/events/${event.id}/get-handout/${handoutBaseName}.pdf`;
    } else {
      response.data.attributes.handoutUrl = null;
    }
    res.send(response);
  } catch (err) {
    // console.log(err);
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};
