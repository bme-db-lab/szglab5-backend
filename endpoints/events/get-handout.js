const { genErrorObj } = require('../../utils/utils.js');
const { getJSONApiResponseFromRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');
const { sheetAvailable, getHandoutBasenameFromEvent, generateHandout, generateXml, generateHandoutPdf } = require('../../utils/generateSheet');
const { access } = require('fs');
const path = require('path');
const logger = require('../../utils/logger.js');
const { promisify } = require('util');

const CACHE_BASE_PATH = path.join(__dirname, '../../handout-cache');

module.exports = async (req, res) => {
  try {
    const reqId = req.params.id;
    const reqIdNum = parseInt(reqId, 10);
    const db = getDB();

    const { roles, userId } = req.userInfo;

    if (roles.includes('STUDENT')) {
      const events = await db.Events.findAll({
        include: {
          attributes: ['id'],
          model: db.StudentRegistrations,
          where: { UserId: userId }
        },
        attributes: ['id']
      });
      const eventIds = events.map(event => event.id);
      if (!eventIds.includes(reqIdNum)) {
        res.status(403).send(genErrorObj('Unathorized'));
        return;
      }
    }

    const event = await db.Events.findById(
      reqIdNum,
      // { include: [{ all: true }] }
      {
        include: [
          {
            model: db.ExerciseSheets,
            include: [
              {
                model: db.ExerciseCategories
              },
              {
                model: db.ExerciseTypes
              }
            ]
          },
          {
            model: db.StudentRegistrations,
            include: {
              model: db.Users
            }
          },
          {
            model: db.Users,
            as: 'Demonstrator',
            attributes: ['id', 'displayName', 'email_official', 'email']
          },
          {
            model: db.Deliverables,
            include: [
              {
                model: db.DeliverableTemplates
              },
              {
                model: db.Users,
                as: 'Corrector',
                attributes: ['id', 'displayName', 'email_official']
              }
            ]
          },
          {
            model: db.EventTemplates,
            include: {
              model: db.ExerciseCategories
            }
          }
        ]
      }
    );
    checkIfExist(event);

    // validation - time
    if (!sheetAvailable(event)) {
      throw new Error('Sheet is not available yet');
    }

    // check if file exists in handout cache
    const basename = getHandoutBasenameFromEvent(event);
    const neptun = event.StudentRegistration.User.neptun;
    const filePath = path.join(CACHE_BASE_PATH, neptun, `${basename}.pdf`);
    try {
      await promisify(access)(filePath);
    } catch (error) {
      logger.info(`File not exists in cache: "${filePath}" generating on the fly`);
      try {
        const handoutDescriptor = generateHandout(event);
        const handoutXml = generateXml({
          handouts: { handout: handoutDescriptor }
        });
        const studentFolderPath = path.join(CACHE_BASE_PATH, neptun);
        const generatedFile = await generateHandoutPdf(handoutXml, basename, studentFolderPath);
  
        res.sendFile(generatedFile);
        return;
      } catch (generationError) {
        logger.info(generationError);
        throw new Error('Sheet generation failed');
      }
    }
    res.sendFile(filePath);
  } catch (err) {
    // console.log(err);
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};
