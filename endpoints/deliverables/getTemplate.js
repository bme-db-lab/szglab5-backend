const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    if (isNaN(reqId)) {
      res.status(400).send(genErrorObj('Requested id is not a number'));
      return;
    }

    const db = getDB();
    db.Deliverables.findById(reqIdNum)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'Deliverables'))
      .then((response) => {
        const template = response.data.relationships.DeliverableTemplate;
        if (template == null) {
          res.status(404).send();
          return;
        }
        db.Users.findById(template.data.id)
          .then(genJSONApiResByRecord.bind(null, db, 'DeliverableTemplates'))
          .then((responseTemplate) => {
            res.send(responseTemplate);
          }).catch((err) => {
            if (err.notFound) {
              res.status(404).send(genErrorObj(err.message));
              return;
            }
            res.status(500).send(genErrorObj(err.message));
          });
      })
      .catch((err) => {
        if (err.notFound) {
          res.status(404).send(genErrorObj(err.message));
          return;
        }
        res.status(500).send(genErrorObj(err.message));
      });
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

/**
 * @api {get} /deliverables/:id/template Get deliverable's template
 * @apiName Get Template
 * @apiGroup Deliverables
 * @apiDescription Get deliverable's template
 *
 * @apiParam {Number} [id] Deliverable's id
 *
 * @apiSuccessExample Success-Response:
 * {
 *     "data": {
 *         "id": 1,
 *         "type": "DeliverableTemplates",
 *         "attributes": {
 *             "displayName": "student",
 *             "loginName": "student",
 *             "password": "$2a$10$Rra6ML3pUC1Cio5sxcM7Be6QcZk5c1BA86ILpibzfXbSIcKV3wWc.",
 *             "email": "student@db.bme.hu",
 *             "sshPublicKey": null,
 *             "colorTheme": "blue-gray",
 *             "subscribedToMailList": false,
 *             "subscribedToEmailNotify": true,
 *             "role": "STUDENT",
 *             "neptun": "STDNT0",
 *             "university": "BME",
 *             "email_official": null,
 *             "mobile": null,
 *             "title": null,
 *             "printSupport": null,
 *             "classroom": null,
 *             "spec": null,
 *             "exercises": null,
 *             "createdAt": "2017-07-12T15:29:43.501Z",
 *             "updatedAt": "2017-07-12T15:29:43.501Z",
 *             "OwnedExerciseId": null
 *         },
 *         "relationships": {
 *             "Deliverables": {
 *                 "data": [
 *                     {
 *                         "id": 2,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 3,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 4,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 5,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 6,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 7,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 8,
 *                         "type": "Deliverables"
 *                     },
 *                     {
 *                         "id": 9,
 *                         "type": "Deliverables"
 *                     }
 *                 ]
 *             }
 *         }
 *     }
 * }
 */
