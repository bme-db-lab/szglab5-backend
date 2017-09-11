const { getDB } = require('../../db/db');
const { genErrorObj } = require('../../utils/utils.js');
const { verifyToken } = require('../../utils/jwt');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const token = req.query.token;
    try {
      await verifyToken(token);
    } catch (err) {
      res.status(403).send(genErrorObj('Invalid token'));
    }

    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    const deliverable = await db.Deliverables.findById(reqIdNum);
    const path = deliverable.dataValues.filePath;
    // TODO: validate path
    res.sendFile(path);
  } catch (err) {
    res.status(500).send({
      errors: [
        {
          message: err.message
        }
      ]
    });
  }
};
