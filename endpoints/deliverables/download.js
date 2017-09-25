const { getDB } = require('../../db/db');
const { genErrorObj } = require('../../utils/utils.js');
const { verifyToken } = require('../../utils/jwt');
const { get } = require('lodash');

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
      return;
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

    const deliverable = await db.Deliverables.findById(reqIdNum, {
      include: [
        {
          attributes: ['id'],
          model: db.Events,
          where: {},
          include: [
            {
              attributes: ['id'],
              model: db.StudentRegistrations,
              where: {},
              include: {
                attributes: ['id', 'neptun'],
                model: db.Users
              }
            },
            {
              attributes: ['id'],
              where: {},
              model: db.EventTemplates,
              include: {
                model: db.ExerciseCategories,
                attributes: ['type']
              }
            }
          ]
        }
      ]
    });
    // const path = deliverable.dataValues.filePath;
    // TODO: validate path
    // res.sendFile(path);
    const userNeptun = get(deliverable, 'Event.StudentRegistration.User.neptun', 'UNKNOWN_STUDENT');
    const exCategoryType = get(deliverable, 'Event.EventTemplate.ExerciseCategory.type', 'UNKNOWN_CATEGORY');
    const fileName = `${userNeptun}_${exCategoryType}_${deliverable.originalFileName}`;
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
