var config = require('../config.js');
var authService = require('./services/authService');
var responses = require('./responses');

function login(req, res, next) {
  // TODO Add proper auth store
  if (authService.authenticate(req.body.username, req.body.password)) {
    return res.status(200).json({
      token: config.AUTH_TOKEN
    });
  } else {
    return next(responses.unauthorized());
  }
}

module.exports = {
  login: login
};
