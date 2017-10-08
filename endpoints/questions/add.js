const { genErrorObj } = require('../../utils/utils.js');
const { checkIfExist, getJSONApiResponseFromRecord, createResource } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const { data } = req.body;
    const db = getDB();

    const { roles } = req.userInfo;
    // only ADMIN DEMONSTRATOR CORRECTOR
    if (!roles.includes('ADMIN') && !roles.includes('DEMONSTRATOR') && !roles.includes('CORRECTOR')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    const createdQuestion = await createResource(db, 'Questions', data);
    checkIfExist(createdQuestion);
    const response = getJSONApiResponseFromRecord(db, 'Questions', createdQuestion);
    res.send(response);
  } catch (err) {
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};

/**
 * @api {post} /test-questions Add Test Question
 * @apiName Post
 * @apiGroup TestQuestions
 * @apiDescription Add a test question
 *
 */
