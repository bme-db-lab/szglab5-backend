const { genErrorObj } = require('../../utils/utils.js');
const { updateResource, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;

    const { data } = req.body;
    const db = getDB();
    const { roles } = req.userInfo;

    // only ADMIN DEMONSTRATOR CORRECTOR
    if (!roles.includes('ADMIN') && !roles.includes('DEMONSTRATOR') && !roles.includes('CORRECTOR')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    const event = await db.Events.findById(reqId);
    checkIfExist(event);
    await updateResource(db, 'Events', data);
    res.status(204).send();
  } catch (err) {
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};

/**
 * @api {patch} /events/:id. Update Event
 * @apiName Patch
 * @apiGroup Events
 * @apiDescription Update an event
 *
 */
