const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const reqUserIdStr = req.params.id;
    const reqUserIdNum = parseInt(reqUserIdStr, 10);
    if (isNaN(reqUserIdNum)) {
      res.status(400).send(genErrorObj('Requested id is not a number'));
      return;
    }

    // const { userId } = req.userInfo;
    // if (reqUserIdNum !== userId) {
    //   res.status(403).send(genErrorObj('You can access only your own user'));
    //   return;
    // }

    const db = getDB();

    // const users = await db.Users.findById(reqUserIdNum);
    // checkIfExist(users);
    // console.log(users);
    // res.send('ok');

    db.Users.findById(reqUserIdNum)
      .then(checkIfExist)
      .then(genJSONApiResByRecord.bind(null, db, 'Users'))
      .then((response) => {
        res.send(response);
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
 * @api {get} /users/:id Get User
 * @apiName Get
 * @apiGroup Users
 * @apiDescription Get user information with id
 *
 * @apiParam {Number} [id] User's id
 *
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "data": {
 *     "id": 1,
 *     "type": "Users",
 *     "attributes": {
 *       "displayName": "Student Sarolta",
 *       "loginName": "student",
 *       "email": "student.email@cool-emailprovider.com",
 *       "sshPublicKey": null,
 *       "colorTheme": "blue-gray",
 *       "role": "STUDENT",
 *       "neptun": "Q87XXZ",
 *       "university": null,
 *       "email_official": null,
 *       "mobile": null,
 *       "title": null,
 *       "printSupport": null,
 *       "classroom": null,
 *       "spec": null,
 *       "exercises": null,
 *       "createdAt": "2017-05-17T23:46:06.642Z",
 *       "updatedAt": "2017-05-17T23:46:06.642Z",
 *       "OwnedExerciseId": null
 *     },
 *     "relationships": {
 *       "StudentRegistrations": {
 *         "data": [
 *           {
 *             "id": 1,
 *             "type": "StudentRegistrations"
 *           }
 *         ]
 *       },
 *       "Deliverables": {
 *         "data": []
 *       },
 *       "Events": {
 *         "data": []
 *       },
 *       "StudentGroups": {
 *         "data": []
 *       },
 *       "ExerciseType": {
 *         "data": null
 *       }
 *     }
 *   }
 * }
 *
 *
 * @apiErrorExample Not own user id:
 * HTTP/1.1 403 Forbidden
 * {
 *   "errors": [
 *     {
 *       "title": "You can access only your own user"
 *     }
 *   ]
 * }
 */
