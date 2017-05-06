const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
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
 *       "displayName": "Jósska Pista",
 *       "loginName": "joskapista",
 *       "email": null,
 *       "sshPublicKey": null,
 *       "neptun": "Q87XXZ",
 *       "university": null,
 *       "email_official": null,
 *       "mobile": null,
 *       "title": null,
 *       "printSupport": null,
 *       "studentgroup_id": null,
 *       "classroom": null,
 *       "spec": null,
 *       "exercises": null,
 *       "ownedExerciseID": null,
 *       "createdAt": "2017-05-06T17:42:31.428Z",
 *       "updatedAt": "2017-05-06T17:42:31.428Z"
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
