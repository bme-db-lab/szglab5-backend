const { getDB } = require('../../db/db');
const { genErrorObj } = require('../../utils/utils.js');
const { verifyToken } = require('../../utils/jwt');

module.exports = async (req, res) => {
  try {
    const db = getDB();
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    const { token } = req.body;
    try {
      await verifyToken(token);
    } catch (err) {
      res.status(403).send(genErrorObj('Invalid token'));
    }
    // TODO: Student csak saját, ADMIN CORRECTOR DEMONSTRATOR akármelyik
    const deliverable = await db.Deliverables.findById(reqIdNum);
    // const path = deliverable.dataValues.filePath;
    // TODO: validate path
    // res.sendFile(path);
    const fileName = deliverable.originalFileName;
    res.redirect(`deliverables/${reqId}/download/${fileName}?token=${token}`);
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
