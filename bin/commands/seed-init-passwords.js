const { readFileSync } = require('fs');
const { join, isAbsolute } = require('path');

const { initDB, closeDB } = require('../../db/db.js');
const parseCSV = require('csv-parse/lib/sync');

// Use this command to load e.g. rapid shell server passwords to the database

module.exports = async (fileName) => {
  console.log(`Parameters received in call: fileName: ${fileName}`);

  try {
    const db = await initDB();

    if (!fileName) {
      throw new Error('No seed file specified!');
    }

    const filePath = isAbsolute(fileName) ? fileName : join(__dirname, 'data', fileName);

    const csvFile = readFileSync(filePath);
    const parsedCsv = parseCSV(csvFile, {
      columns: ['neptun', 'password']
    });
    let updatedUserPassword = 0;
    for (const csvRecord of parsedCsv) {
      const { neptun, password } = csvRecord;
      // Find user for the record
      const user = await db.Users.find({
        where: {
          neptun: {
            $iLike: neptun
          }
        }
      });
      if (user) {
        // Set user password
        await user.update(
          {
            initPassword: password
          });
        updatedUserPassword++;
      } else {
        console.log(`User not found with neptun: "${neptun}"`);
      }
    }
    console.log(`Updated ${updatedUserPassword} user password!`);
  } catch (error) {
    console.log('Error occured while seed-init-passwords');
    console.log(error);
  } finally {
    await closeDB();
  }
};
