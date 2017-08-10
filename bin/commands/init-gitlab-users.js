const { createGitlabUser } = require('../../utils/gitlab');

module.exports = async () => {
  console.log('hello!');
  await createGitlabUser('newuser', 'name', 'a@a.a', '1234512345');
};
