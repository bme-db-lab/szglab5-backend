const fetch = require('node-fetch');
const config = require('../../../config/config');

module.exports = async (username, name, email, password) => {
  const { baseUrl, privateToken } = config.gitlab;
  const url = `${baseUrl}/users`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'PRIVATE-TOKEN': privateToken
    },
    body: JSON.stringify({
      username,
      name,
      email,
      password
    })
  });
  // console.log(response.status);
  const responseJSON = await response.json();
  // console.log(responseJSON);
};

