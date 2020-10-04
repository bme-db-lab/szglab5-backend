const xmlbuilder = require('xmlbuilder');
const config = require('../config/config.js');
const fs = require('fs');
const tmp = require('tmp');
const path = require('path');
const { promisify } = require('util');
const { exec, execSync } = require('child_process');
const makeDir = require('make-dir');
const moment = require('moment');
const logger = require('../utils/logger.js');

function generateHandout(event) {
  const exerciseSheet = event.ExerciseSheet;
  const exerciseCategory = exerciseSheet.ExerciseCategory;
  const exerciseType = exerciseSheet.ExerciseType;
  const student = event.StudentRegistration.User;
  const demonstrator = event.Demonstrator;

  const categoryId = exerciseCategory.id;
  const categoryName = exerciseCategory.type;
  const exerciseTypeId = exerciseType.exerciseId;
  const shortName = exerciseType.shortName;
  const exerciseTypeName = exerciseType.name;
  const studentName = student.displayName;
  const demonstratorName = demonstrator.displayName;
  const timeOfEvent = moment(event.date);
  const rapidInitialPassword = student.initPassword || 'coming soon...';

  return {
    'exercise-description': {
      '@category': categoryId,
      '@category-name': categoryName,
      '@type': exerciseTypeId,
      '@shortname': shortName,
      '#text': exerciseTypeName
    },
    entries: {
      entry: [
        {
          '@description': 'Hallgató neve',
          '#text': studentName
        },
        {
          '@description': 'Mérésvezető',
          '#text': demonstratorName
        },
        {
          '@description': 'Mérés időpontja',
          '#text': timeOfEvent.format('YYYY-MM-DD HH:mm')
        }
      ]
    }
  };
}

function concatHandouts(handouts) {
  return {
    handouts: {
      handout: handouts
    }
  };
}

function generateXml(handoutsObj) {
  const node = xmlbuilder.create(handoutsObj);
  return node.end({ pretty: true });
}

function generateHandoutPdf(sheetXml, basename, targetDirectory) {
  // copy xml file to handout folder in a temp folder
  const tempFolder = tmp.tmpNameSync();
  const tempPath = path.join(config.handoutGeneratorRoot, 'handout', tempFolder);
  makeDir.sync(tempPath);
  fs.writeFileSync(path.join(tempPath, `${basename}.xml`), sheetXml);
  // generate pdf
  execSync(`scons HD=${path.join(tempFolder.substr(1), basename)} PDF=1`, {
    cwd: config.handoutGeneratorRoot
  });

  const createdPdfPath = path.join(tempPath, `${basename}.pdf`);
  // copy pdf to target directory
  execSync(`cp ${createdPdfPath} ${targetDirectory}`);
  // remove temp folder from handout generator
  execSync(`rm -rf ${tempPath}`);
  // return path
  return path.join(targetDirectory, `${basename}.pdf`);
}

async function generateZip(studentGroupId, eventTemplateId, sheetXml) {
  const tmpNamePromisified = promisify(tmp.tmpName);
  const fsWriteFilePromisified = promisify(fs.writeFile);
  const xmlFileName = await tmpNamePromisified({ prefix: `laboradmin-handouts-${studentGroupId}-${eventTemplateId}`, postfix: '.xml' });
  const xmlBaseName = xmlFileName.substr(xmlFileName.lastIndexOf('/') + 1);

  await fsWriteFilePromisified(xmlFileName, sheetXml);
  const pexec = promisify(exec);

  const genFileDir = `${config.generatedFilesPath}/handout/${studentGroupId}-${eventTemplateId}/`;
  await makeDir(genFileDir);

  const zipBaseName = xmlBaseName.replace(/\.xml/, '.zip');
  const genFilePath = (genFileDir + zipBaseName).replace(/\/\//, '/');
  const scriptOutput = await pexec(`/usr/local/bin/genhandout.sh ${xmlFileName} ${genFileDir}`);
  logger.debug('genhandout: ', scriptOutput.stdout, '\n', scriptOutput.stderr);
  return genFilePath;
}

module.exports = {
  generateHandout,
  generateXml,
  concatHandouts,
  generateZip,
  generateHandoutPdf
};
