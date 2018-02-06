const iconv = require('iconv-lite');

const { getDB } = require('../../db/db.js');
const { genErrorObj } = require('../../utils/utils.js');
const { signToken } = require('../../utils/jwt');

// Information from Shibboleth module
// eppn: 222222@bme.hu
// affiliation: member@bme.hu;student@bme.hu
// unscoped-affiliation:
// entitlement:
// targeted-id:
// persistent-id:
// email: gipsz.jakab@gmail.com
// displayname: Gipsz JÃ¡kab
// surname: Gipsz
// givenname: JÃ¡kab
// niifpersonorgid: NEPTUN1
// niifedupersonfaculty: VillamosmÃ©rnÃ¶ki Ã©s Informatikai Kar
// cn: Gipsz, JÃ¡kab
// shib-application-id: default
// remote_user: 222222@bme.hu

function fixEncoding(wrongEncodedString) {
  const wrongEncodedStringBytes = Buffer.from(iconv.encode(Buffer.from(wrongEncodedString), 'iso-8859-1'));
  const rightEncodedString = iconv.decode(wrongEncodedStringBytes, 'utf-8').toString();
  return rightEncodedString;
}

module.exports = async (req, res) => {
  // get user data from request
  const {
    givenname,
    email,
    displayname,
    cn,
    eppn,
    surname,
    niifpersonorgid
  } = req.headers;

  const neptunFixed = fixEncoding(niifpersonorgid);
  const displayNameFixed = fixEncoding(displayname);
  const emailFixed = fixEncoding(email);

  console.log(`Neptun: ${neptunFixed}, displayName: ${displayNameFixed}, email: ${emailFixed}`);

  const db = getDB();
  const user = await db.Users.findOne({
    where: {
      neptun: {
        $iLike: neptunFixed
      }
    }
  });
  if (user === null) {
    res.status(403).send(genErrorObj([`User with neptun "${neptunFixed}" does not exist!`]));
    return;
  }
  console.log('email from db', user.email);
  console.log('displayname from db', user.displayName);
  // Check if first login with shibboleth
  if (user.email === null || user.displayName === null) {
    console.log('Updating user');
    // Update user data
    await user.update({
      displayName: displayNameFixed,
      email: emailFixed
    });
  }
  // Sign token for the user
  const roles = await user.getRoles();
  const roleNames = roles.map(role => role.dataValues.name);
  const token = await signToken(user.dataValues, roleNames);

  res.send(token);
};
