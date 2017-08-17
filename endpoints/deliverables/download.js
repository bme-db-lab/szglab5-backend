const { getDB } = require('../../db/db');

module.exports = async (req, res) => {
  try {
    const db = getDB();
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    if (isNaN(reqId)) {
      throw new Error('Request id is invalid');
    }
    const deliverable = await db.Deliverables.findById(reqIdNum);
    const path = deliverable.dataValues.filePath;
    res.sendfile(path);
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
