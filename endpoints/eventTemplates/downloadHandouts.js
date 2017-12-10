// const { genErrorObj } = require('../../utils/utils.js');
const { verifyToken } = require('../../utils/jwt');
const { getDB } = require('../../db/db.js');
const sheet = require('../../utils/generateSheet.js');
const logger = require('../../utils/logger.js');
const { genErrorObj } = require('../../utils/utils.js');

/*
function getEventsByDemonstrator(demonstrator, db) {
  return new Promise((resolve, reject) => {
    const events = [];
    const promises = [];
    demonstrator.StudentGroups.forEach((studentGroup) => {
      studentGroup.StudentRegistrations.forEach((studentRegistration) => {
        studentRegistration.Events.forEach((event) => {
          promises.push(db.Events.findById(event.id, {
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
                as: 'Demonstrator'
              }
            ]
          }).then((result) => {
            events.push(result);
          }).catch((err) => {
            throw err;
          }));
        });
      });
    });
    Promise.all(promises).then(() => {
      resolve(events);
    }).catch((err) => { reject(err); });
  });
}*/

function getEventsByDemonstrator(demonstrator, db, supplementary) {
  return new Promise((resolve, reject) => {
    const events = [];
    const promises = [];
    demonstrator.Events.forEach((event) => {
      promises.push(db.Events.find({
        where: {
          id: event.id,
          attempt: supplementary === 'true' ? 2 : null
        },
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
            as: 'Demonstrator'
          }
        ]
      }).then((result) => {
        if (result) {
          events.push(result);
        }
      }).catch((err) => {
        throw err;
      }));
    });
    Promise.all(promises).then(() => {
      resolve(events);
    }).catch((err) => { reject(err); });
  });
}


module.exports = async (req, res) => {
  /*  get user by token */
  const { token, supplementary } = req.body;

  let userInfo;
  try {
    userInfo = await verifyToken(token);
  } catch (err) {
    res.status(403).send(JSON.stringify(err));
  }

  const { roles } = userInfo;
  if (roles.includes('STUDENT')) {
    res.status(403).send(genErrorObj('Unathorized'));
    return;
  }

  try {
    const db = getDB();
    /* Get events and related data by demonstrator (User) */
    const user = await db.Users.findById(userInfo.userId, {
      include: {
        model: db.Events,
        where: { EventTemplateId: req.params.id }
      }
    });

    const events = await getEventsByDemonstrator(user, db, supplementary);

    const handoutDescriptorObjects = [];
    events.forEach((event) => {
      handoutDescriptorObjects.push(sheet.generateHandout(event));
    });
    const handoutsObj = sheet.concatHandouts(handoutDescriptorObjects);
    logger.debug(JSON.stringify(handoutsObj));
    const xml = sheet.generateXml(handoutsObj);
    const genFilePath = await sheet.generateZip(1, 1, xml);

    res.sendFile(genFilePath);
  } catch (err) {
    res.status(500).send(err.stack);
  }
};
