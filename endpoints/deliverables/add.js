const { genErrorObj } = require('../../utils/utils.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    throw new Error('Not implemented exception!');
    const { data } = req.body;
    const db = getDB();

    await db.Deliverables.create(data.attributes);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};

/**
 * @api {post} /deliverables Add Deliverable
 * @apiName Post
 * @apiGroup Deliverables
 * @apiDescription Add a deliverable
 *
 */
