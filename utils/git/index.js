const gitlabFuncs = require('./gitlab');
const gogsFuncs = require('./gogs');
const config = require('../../config/config');

async function createUser(username, name, email, password) {
  switch (config.git.provider) {
    case 'gitlab':
      gitlabFuncs.createUser(username, name, email, password);
      break;
    case 'gogs':
      gogsFuncs.createUser(username, name, email, password);
      break;
    default:
      throw new Error(`Unknown git provider: "${config.git.provider}"`);
  }
}

module.exports = {
  createUser
};
