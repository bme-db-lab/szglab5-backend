const { getDB } = require('../../db/db');
const { genErrorObj } = require('../../utils/utils.js');
const { verifyToken } = require('../../utils/jwt');

module.exports = async (req, res) => {
  try {
    const db = getDB();
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    const { token } = req.body;
    let userInfo;
    try {
      userInfo = await verifyToken(token);
    } catch (err) {
      res.status(403).send(genErrorObj('Invalid token'));
    }
    const { roles, userId } = userInfo;

    // TODO: Student should only access its own deliverable, ADMIN CORRECTOR DEMONSTRATOR should access every
    if (roles.includes('STUDENT')) {
      const deliverables = await db.Deliverables.findAll({
        include: [
          {
            attributes: ['id'],
            model: db.Events,
            where: {},
            include: {
              attributes: ['id'],
              model: db.StudentRegistrations,
              where: { UserId: userId }
            }
          }
        ],
        attributes: ['id']
      });
      const deliverableIds = deliverables.map(del => del.id);
      if (!deliverableIds.includes(reqIdNum)) {
        res.status(403).send(genErrorObj('Unathorized'));
        return;
      }
    }

    const deliverable = await db.Deliverables.findById(reqIdNum);
    // const path = deliverable.dataValues.filePath;
    // TODO: validate path
    // res.sendFile(path);
    const fileName = deliverable.originalFileName;
    res.redirect(`download/${fileName}?token=${token}`);
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
