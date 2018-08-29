const { genErrorObj } = require('../../utils/utils.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const { roles } = req.userInfo;

    // only ADMIN DEMONSTRATOR CORRECTOR
    if (!roles.includes('ADMIN') && !roles.includes('DEMONSTRATOR') && !roles.includes('CORRECTOR')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    const neptun = req.params.neptun;
    const db = getDB();
    const queryObj = {
      where: {
        neptun: {
          ilike: neptun
        }
      },
      attributes: ['id', 'neptun', 'displayName'],
      include: {
        model: db.StudentRegistrations,
        include: {
          model: db.StudentGroups
        }
      }
    };

    const user = await db.Users.findOne(queryObj);
    if (!user) {
      const error = new Error(`User not found with neptun: ${neptun}`);
      error.notFound = true;
      throw error;
    }

    res.send({
      displayName: user.displayName,
      neptun: user.neptun,
      studentGroup: user.StudentRegistrations[0].StudentGroup.name
    });
  } catch (err) {
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};
