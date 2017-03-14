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
 *     "type": "languages",
 *       "id": 1,
 *       "attributes": {
 *         "name": "Oracle"
 *       }
 *     },
 *     {
 *       "type": "languages",
 *       "id": 2,
 *       "attributes": {
 *         "name": "SQL"
 *       }
 *     },
 *     {
 *       "type": "languages",
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
    db.Language.findAll({})
      .then((languages) => {
        const languageData = languages.map(language => ({
          type: 'languages',
          id: language.id,
          attributes: {
            name: language.name
          }
        }));
        res.send({
          data: languageData
        });
      })
      .catch((err) => {
        res.status(500).send({ errors: [err.message] });
      });
  } catch (err) {
    res.status(500).send({ errors: [err.message] });
  }
};
