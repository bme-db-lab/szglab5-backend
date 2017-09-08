const { genErrorObj } = require('../../utils/utils.js');
// const { genJSONApiResponseFromRecord, checkIfExist } = require('../../utils/jsonapi.js');
const { getDB } = require('../../db/db.js');
const generateSheet = require('../../utils/generateSheet.js');
const config = require('../../config/config.js');
const fs = require('fs');
const tmp = require('tmp');
const { promisify } = require('util');
const { exec } = require('child_process');
const makeDir = require('make-dir');
const logger = require('../../utils/logger.js');

module.exports = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const db = getDB();
    const event = await db.Events.findById(eventId, {
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
          as: 'Demonstrator'
        }
      ]
    });

    const sheetXml = generateSheet(event);

    const tmpNamePromisified = promisify(tmp.tmpName);
    const fsWriteFilePromisified = promisify(fs.writeFile);
    const xmlFileName = await tmpNamePromisified({ prefix: `laboradmin-event-${eventId}-`, postfix: '.xml' });
    const xmlBaseName = xmlFileName.substr(xmlFileName.lastIndexOf('/') + 1);

    await fsWriteFilePromisified(xmlFileName, sheetXml);
    const pexec = promisify(exec);

    const genFileDir = `${config.generatedFilesPath}/event/${eventId}/`;
    await makeDir(genFileDir);

    const zipBaseName = xmlBaseName.replace(/\.xml/, '.zip');
    const genFilePath = genFileDir + zipBaseName;
    const scriptOutput = await pexec(`sudo /usr/local/bin/genhandout.sh ${xmlFileName} ${genFileDir}`);
    logger.log('genhandout: ', scriptOutput);

    res.contentType('application/zip');
    res.header('Content-Disposition', `attachment; filename="${zipBaseName}"`);
    res.sendFile(genFilePath);
  } catch (err) {
    logger.log(err.stack);
    res.status(500).send(genErrorObj(err.message));
  }
};

