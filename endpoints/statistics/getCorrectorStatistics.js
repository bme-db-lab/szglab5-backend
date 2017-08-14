const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('../../utils/utils.js');

// http://expressjs.com/en/api.html#req.query
// localhost:7000/statistics/student?studentId=1
module.exports = async (req, res) => {
  try {;
    const db = getDB();
    const correctors = [];
    const roleQuery = await db.Roles.findOne({ where: { name: 'CORRECTOR' } });
    const correctorRoleQuery = await db.UserRoles.findAll({ where: { RoleId: roleQuery.dataValues.id } });
    for (const role of correctorRoleQuery) {
      const correctorQuery = await db.Users.findById(role.dataValues.UserId);
      const resCorrector = {
        id: correctorQuery.dataValues.id,
        email: correctorQuery.dataValues.email_official,
        unfinalizedNum: 0
      };
      const deliverableQuery = await db.Deliverables.findAll({ where: { CorrectorId: correctorQuery.dataValues.id } });
      for (const deliverable of deliverableQuery) {
        if (deliverable.dataValues.finalized === undefined ||
            deliverable.dataValues.finalized === null ||
            deliverable.dataValues.finalized === false) {
          resCorrector.unfinalizedNum += 1;
        }
      }
      correctors.push(resCorrector);
    }


    res.send({ correctors });
  } catch (error) {
    res.status(500).send(genErrorObj(error.message));
  }
};
