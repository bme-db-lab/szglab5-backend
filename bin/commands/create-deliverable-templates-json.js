const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');
const config = require('../../config/config');

module.exports = async () => {
  try {
    const db = await initDB();

    const jsonFiles = fs.readdirSync(path.join(__dirname, 'data'));

    const jsonFileChoices =
      jsonFiles
        .filter(jsonFile => jsonFile.match(/.json$/g))
        .map(jsonFile => ({
          name: jsonFile,
          value: jsonFile
        }));

    const prompt = await inquirer.prompt([
      {
        type: 'list',
        choices: jsonFileChoices,
        message: 'json file',
        name: 'path'
      }
    ]);
    const jsonFile = fs.readFileSync(path.join(__dirname, 'data', prompt.path));
    const newDeliverableTemplates = JSON.parse(jsonFile.toString());
    console.log(newDeliverableTemplates);
    for (const newDeliverableTemplate of newDeliverableTemplates) {
      console.log('Creating DeliverableTemplate ...');
      const createdDeliverableTemplate = await db.DeliverableTemplates.create(newDeliverableTemplate);
      console.log('Created:');
      console.log(createdDeliverableTemplate.dataValues);
    }
  } catch (err) {
    console.log(err);
  } finally {
    await closeDB();
  }
};

