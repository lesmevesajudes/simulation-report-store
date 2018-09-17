var config = require('../config.js');

function login(req, res, next) {
  console.log(req.body);
  // TODO Add proper auth store
  if (req.body.username === 'admin') {
    return res.status(200).json({
      token: config.AUTH_TOKEN
    });

  }
}

module.exports = {
  login: login
};
