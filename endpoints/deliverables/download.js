const { getDB } = require('../../db/db');

module.exports = async (req, res) => {
  try {
    const db = getDB();
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    console.log(req.userInfo);
    // TODO: Student csak saját, ADMIN CORRECTOR DEMONSTRATOR akármelyik

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
