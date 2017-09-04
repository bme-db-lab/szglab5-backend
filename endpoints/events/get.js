const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);

    const db = getDB();
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
            model: db.StudentRegistrations
          },
          {
            model: db.Users,
            as: 'Demonstrator'
          },
          {
            model: db.Deliverables,
            include: {
              model: db.DeliverableTemplates
            }
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
    const response = getJSONApiResponseFromRecord(db, 'Events', event, {
      includeModels: ['Users', 'ExerciseSheets', 'Deliverables', 'EventTemplates', 'DeliverableTemplates']
    });
    res.send(response);
  } catch (err) {
    console.log(err);
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};

// const { genErrorObj } = require('../../utils/utils.js');
// const { genJSONApiResByRecord, checkIfExist } = require('../../utils/jsonapi.js');
// const { getDB } = require('../../db/db.js');

// module.exports = async (req, res) => {
//   try {
//     const reqId = req.params.id;
//     const reqIdNum = parseInt(reqId, 10);
//     if (isNaN(reqId)) {
//       res.status(400).send(genErrorObj('Requested id is not a number'));
//       return;
//     }

//     const db = getDB();
//     const event = await db.Events.findById(reqIdNum);
//     checkIfExist(event);
//     const response = await genJSONApiResByRecord(db, 'Events', event);
//     response.included = [];
//     // Included: Demonstrator
//     if (response.data.relationships.Demonstrator.data !== null) {
//       const demonstrator = await db.Users.findById(response.data.relationships.Demonstrator.data.id);
//       response.included.push({
//         id: response.data.relationships.Demonstrator.data.id,
//         type: 'Users',
//         attributes: demonstrator.dataValues
//       });
//     }
//     // Included: ExerciseSheet
//     if (response.data.relationships.ExerciseSheet.data !== null) {
//       const exerciseSheet = await db.ExerciseSheets.findById(response.data.relationships.ExerciseSheet.data.id);
//       const exerciseCategory = await exerciseSheet.getExerciseCategory();
//       const exerciseType = await exerciseSheet.getExerciseType();

//       let exerciseCategoryRel = null;
//       if (exerciseCategory !== null) {
//         exerciseCategoryRel = {
//           data: {
//             id: exerciseCategory.id,
//             type: 'ExerciseCategories'
//           }
//         };
//         response.included.push({
//           id: exerciseCategory.id,
//           type: 'ExerciseCategories',
//           attributes: exerciseCategory.dataValues,
//         });
//       }

//       let exerciseTypeRel = null;
//       if (exerciseCategory !== null) {
//         exerciseTypeRel = {
//           data: {
//             id: exerciseType.id,
//             type: 'ExerciseTypes'
//           }
//         };
//         response.included.push({
//           id: exerciseType.id,
//           type: 'ExerciseTypes',
//           attributes: exerciseType.dataValues,
//         });
//       }

//       response.included.push({
//         id: response.data.relationships.ExerciseSheet.data.id,
//         type: 'ExerciseSheets',
//         attributes: exerciseSheet.dataValues,
//         relationships: {
//           ExerciseCategory: exerciseCategoryRel,
//           ExerciseType: exerciseTypeRel
//         }
//       });
//     }
//     // Included: Deliverables
//     if (response.data.relationships.Deliverables.data.length !== 0) {
//       for (const delItem of response.data.relationships.Deliverables.data) {
//         const deliverables = await db.Deliverables.findById(delItem.id);
//         const deliverableTemplate = await deliverables.getDeliverableTemplate();
//         const corrector = await deliverables.getCorrector();

//         let delTemplateRel = null;
//         if (deliverableTemplate) {
//           delTemplateRel = {
//             data: {
//               id: deliverableTemplate.id,
//               type: 'DeliverableTemplates'
//             }
//           };
//           response.included.push({
//             id: deliverableTemplate.id,
//             type: 'DeliverableTemplates',
//             attributes: deliverableTemplate.dataValues
//           });
//         }
//         let correctorRel = { data: null };
//         if (corrector) {
//           correctorRel = {
//             data: {
//               id: corrector.id,
//               type: 'Users'
//             }
//           };
//         }

//         response.included.push({
//           id: deliverables.dataValues.id,
//           type: 'Deliverables',
//           attributes: deliverables.dataValues,
//           relationships: {
//             DeliverableTemplate: delTemplateRel,
//             Corrector: correctorRel
//           }
//         });
//       }
//     }
//     // Included: EventTemplate
//     if (response.data.relationships.EventTemplate.data !== null) {
//       const eventTemplate = await db.EventTemplates.findById(response.data.relationships.EventTemplate.data.id);
//       const exCat = await eventTemplate.getExerciseCategory();

//       let exCatRel = null;
//       if (exCat) {
//         exCatRel = {
//           data: {
//             id: exCat.id,
//             type: 'ExerciseCategories'
//           }
//         };
//       }

//       response.included.push({
//         id: response.data.relationships.EventTemplate.data.id,
//         type: 'EventTemplates',
//         attributes: eventTemplate.dataValues,
//         relationships: {
//           ExerciseCategory: exCatRel
//         }
//       });
//     }
//     res.send(response);
//   } catch (err) {
//     if (err.notFound) {
//       res.status(404).send(genErrorObj(err.message));
//       return;
//     }
//     res.status(500).send(genErrorObj(err.message));
//   }
// };
