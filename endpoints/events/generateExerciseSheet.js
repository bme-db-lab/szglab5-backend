const { genErrorObj } = require('../../utils/utils.js');
// const { genJSONApiResponseFromRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');
const generateSheet = require('../../utils/generateSheet.js');

module.exports = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const db = getDB();
    const event = await db.Events.findById(eventId, {
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
    });

    const exerciseSheet = event.ExerciseSheet;
    const exerciseCategory = exerciseSheet.ExerciseCategory;
    const exerciseType = exerciseSheet.ExerciseType;
    const student = event.StudentRegistration.User;
    const demonstrator = event.Demonstrator;

    const sheet = generateSheet(exerciseCategory, exerciseType, student, demonstrator, event);
    console.log(sheet);

    // checkIfExist(event);
    // const response = await genJSONApiResByRecord(db, 'Events', event);
    // res.send(response);
    res.contentType('application/xml').send(sheet);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
    console.log(err);
  }
};

