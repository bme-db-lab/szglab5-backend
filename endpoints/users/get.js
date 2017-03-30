const { genErrorObj } = require('../../utils/utils.js');
const { genJSONApiResByRecord } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = (req, res) => {
  try {
    const reqUserIdStr = req.params.id;
    const reqUserIdNum = parseInt(reqUserIdStr, 10);
    if (isNaN(reqUserIdNum)) {
      res.status(400).send(genErrorObj('Requested id is not a number'));
      return;
    }

    const { userId } = req.userInfo;
    if (reqUserIdNum !== userId) {
      res.status(403).send(genErrorObj('You can access only your own user'));
      return;
    }

    const db = getDB();
    db.Users.findById(reqUserIdNum)
      .then(genJSONApiResByRecord.bind(null, db, 'Users'))
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.status(500).send(genErrorObj(err.message));
      });
    // all check has been passed, get that user
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
 *     "displayName": "Jósska Pista",
 *     "loginName": "joskapista",
 *     "password": "$2a$10$OW5JlOQM0x5Wdce48WbjZestlTG6XdOHXE0PjB6F8aima.NsgiZiO",
 *     "email": null,
 *     "sshPublicKey": null,
 *     "neptun": "Q87XXZ",
 *     "university": null,
 *     "createdAt": "2017-03-30T12:20:00.435Z",
 *     "updatedAt": "2017-03-30T12:20:00.435Z"
 *   },
 *   "relationships": {
 *     "StudentRegistrations": {
 *       "data": [
 *         {
 *           "id": 1,
 *           "type": "StudentRegistrations"
 *         }
 *       ]
 *     }
 *   }
 *
 *
 * @apiErrorExample User not exist:
 * HTTP/1.1 403 Not own user id
 * {
 *   "errors": [
 *     {
 *       "title": "You can access only your own user"
 *     }
 *   ]
 * }
 */
