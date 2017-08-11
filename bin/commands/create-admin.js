const { initDB, closeDB } = require('../../db/db.js');
const logger = require('../../utils/logger.js');
const inquirer = require('inquirer');
const { seedDBwithObjects } = require('./../../db/seed');

module.exports = async () => {
  const name = await inquirer.prompt([
    {
      type: 'input',
      name: 'res',
      message: 'Please choose a username for admin.',
    }
  ]);
  const pass = await inquirer.prompt([
    {
      type: 'input',
      name: 'res',
      message: 'Please choose a password for admin.',
    }
  ]);

  const db = await initDB();
  const admin = [{
    data: {
      loginName: name.res, //idc about sql injection, since the one who uses it already has admin access to db
      password: pass.res
    }
  }];

  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'res',
      message: `Are you sure you want to add Username: "${name.res}" Password: "${pass.res}" as admin?`
    }
  ]);

  if (!answers.res) {
    logger.info('Admin creation cancelled!');
    return;
  }

  try {
    await seedDBwithObjects(db, 'Users', admin);
  } catch (error) {
    throw error;
  }

  const adminId = await db.Users.findOne({ where: { loginName: name.res } });
  const roleId = await db.Roles.findOne({ where: { name: 'ADMIN' } });
  const adminRole = [{
    data: {
      RoleId: roleId.dataValues.id,
      UserId: adminId.dataValues.id
    }
  }];

  try {
    await seedDBwithObjects(db, 'UserRoles', adminRole);
  } catch (error) {
    throw error;
  }

  logger.info('Succesfully added new admin user!');

  await closeDB();
};
