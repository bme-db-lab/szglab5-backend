const { getDB } = require('../../db/db.js');

/**
 * @api {get} /languages list
 * @apiName ListLanguages
 * @apiGroup Language
 *
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "data": [
 *    {
 *     "type": "Language",
 *       "id": 1,
 *       "attributes": {
 *         "name": "Oracle"
 *       }
 *     },
 *     {
 *       "type": "Language",
 *       "id": 2,
 *       "attributes": {
 *         "name": "SQL"
 *       }
 *     },
 *     {
 *       "type": "Language",
 *       "id": 3,
 *       "attributes": {
 *         "name": "DBM"
 *       }
 *     }
 *   ]
 *  }
 */
module.exports = (req, res) => {
  // TODO query the tests for the database and send back
  try {
    const db = getDB();
    db.QuestionType.findAll({})
      .then((tests) => {
        const questionTypesData = tests.map(questionType => ({
          type: 'Language',
          id: questionType.id,
          attributes: {
            name: questionType.name
          }
        }));
        res.send({
          data: questionTypesData
        });
      })
      .catch((err) => {
        res.status(500).send({ errors: [err] });
      });
  } catch (err) {
    res.status(500).send({ errors: [err] });
  }
};
