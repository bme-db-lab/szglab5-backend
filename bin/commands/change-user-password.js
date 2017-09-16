const bcrypt = require('bcrypt');
const inquirer = require('inquirer');
const generator = require('generate-password');

const config = require('../../config/config');
const { initDB, closeDB } = require('../../db/db.js');

module.exports = async () => {
  try {
    const db = await initDB();


    const userPromptResult = await inquirer.prompt([
      {
        type: 'input',
        name: 'loginName',
        message: 'Users\'s login name'
      }
    ]);
    const user = await db.Users.find({
      where: {
        loginName: {
          $iLike: userPromptResult.loginName
        }
      }
    });

    if (!user) {
      throw new Error(`User not found with login name: ${userPromptResult.loginName}`);
    }
    console.log(`User: ${user.dataValues.displayName} Neptun: ${user.dataValues.neptun}`);

    const initPassword = generator.generate({
      length: 10,
      numbers: true,
      excludeSimilarCharacters: true
    });
    console.log(`New password is "${initPassword}"`);
    const passwordHash = bcrypt.hashSync(initPassword, config.bcrypt.saltRounds);
    await db.Users.update(
      {
        password: passwordHash
      },
      {
        where: {
          loginName: { $iLike: userPromptResult.loginName }
        }
      });
  } catch (err) {
    console.log(err);
  } finally {
    await closeDB();
  }
  // const passwordHash = bcrypt.hashSync(passwordPromptResult.newPassword, config.bcrypt.saltRounds);
};
