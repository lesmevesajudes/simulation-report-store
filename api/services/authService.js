var config = require('../../config.js');

function authenticate (username, password)
{
  return username === config.AUTH_USER && password === config.AUTH_PASSWORD
}

module.exports = {
  authenticate: authenticate
};
