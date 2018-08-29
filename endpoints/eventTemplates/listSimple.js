const { genErrorObj } = require('../../utils/utils.js');
const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();
    const { roles } = req.userInfo;

    // only ADMIN DEMONSTRATOR CORRECTOR
    if (!roles.includes('ADMIN') && !roles.includes('DEMONSTRATOR') && !roles.includes('CORRECTOR')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    const eventTemplates = await db.EventTemplates.findAll({
      include: {
        model: db.ExerciseCategories
      }
    });
    const eventTemplateChoices = eventTemplates.map(eventTemplate => ({
      eventTemplateType: eventTemplate.type,
      eventTemplateSeq: eventTemplate.seqNumber,
      exerciseCategoryType: eventTemplate.ExerciseCategory.type
    }));
    res.send(eventTemplateChoices);
  } catch (err) {
    res.status(500).send(genErrorObj(err.message));
  }
};
