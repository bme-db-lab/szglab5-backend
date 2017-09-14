const bcrypt = require('bcrypt');
const inquirer = require('inquirer');
const config = require('../../config/config');


module.exports = async () => {
  const userPromptResult = await inquirer.prompt([
    {
      type: 'input',
      name: 'loginName',
      message: 'Users\'s login name'
    }
  ]);
  console.log(userPromptResult);

  // const passwordHash = bcrypt.hashSync(passwordPromptResult.newPassword, config.bcrypt.saltRounds);
};
