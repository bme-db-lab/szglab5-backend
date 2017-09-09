// const { genErrorObj } = require('../../utils/utils.js');
// const { verifyToken } = require('../../utils/jwt');
const { getDB } = require('../../db/db.js');
const sheet = require('../../utils/generateSheet.js');


module.exports = async (req, res) => {
  /* TODO: get user by token
    const { token } = req.body;
  try {
    await verifyToken(token);
  } catch (err) {
    res.status(403).send(JSON.stringify(err));
  }
  */

  try {
    const db = getDB();
  /* TODO: Get events and related data by demonstrator (User)
    const user = await db.Users.findById(1, {
      include: {
        model: db.StudentGroups,
        all: true,
        include: {
          model: db.StudentRegistrations,
          all: true,
          include: [
            {
              model: db.Events,
              all: true,
              include: {
                model: db.ExerciseSheets,
                include: [
                  {
                    model: db.ExerciseCategories
                  },
                  {
                    model: db.ExerciseTypes
                  }
                ]
              }
            },
            {
              model: db.Users
            }
          ]
        }
      }
    });


    const events = [];
    user.StudentGroups.forEach((studentGroup) => {
      studentGroup.StudentRegistrations.forEach((studentRegistration) => {
        studentRegistration.Events.forEach((event) => {
          events.push(event);
        });
      });
    });
    */

    // mock
    const events = [
      await db.Events.findById(1, {
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
      })
    ]; // end mock

    const handoutDescriptorObjects = [];
    events.forEach((event) => {
      handoutDescriptorObjects.push(sheet.generateHandout(event));
    });
    const handoutsObj = sheet.concatHandouts(handoutDescriptorObjects);
    const xml = sheet.generateXml(handoutsObj);
    const genFilePath = await sheet.generateZip(1, 1, xml);

    res.sendFile(genFilePath);
  } catch (err) {
    res.status(500).send(err.stack);
  }
};
