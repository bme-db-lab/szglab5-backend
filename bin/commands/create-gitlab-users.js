const { createGitlabUser } = require('../../utils/gitlab');

module.exports = async () => {
  await createGitlabUser('newuser', 'name', 'a@a.a', '1234512345');
};
