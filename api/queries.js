var promise = require('bluebird');
var config = require('../config.js');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = config.DATABASE_CONNECTION_STRING;
var db = pgp(connectionString);

function authenticate(req, token) {
  var clientToken = req.get('Authentication-Token');
  return clientToken === token;
}

function Unauthorized() {
  var err = new Error('Unauthorized');
  err.status = 401;
}

function getAllSimulations(req, res, next) {
  if (authenticate(req, config.AUTH_TOKEN)) {
    db.any('SELECT * FROM simulations')
        .then(function (data) {
          res.status(200)
              .json({
                status: 'success',
                data: data,
                message: 'Retrieved all simulations'
              });
        })
        .catch(function (err) {
          return next(err);
        });
  } else {
    return next(Unauthorized());
  }

}

function getSimulation(req, res, next) {
  if (authenticate(req, config.AUTH_TOKEN)) {
    db.one('SELECT * FROM simulations WHERE id = $1', id)
        .then(function (data) {
          res.status(200)
              .json({
                status: 'success',
                data: data,
                message: 'Retrieved one simulation'
              });
        })
        .catch(function (err) {
          return next(err);
        });
  } else {
    return next(Unauthorized());
  }
}

function createSimulation(req, res, next) {
  console.log(req.body);
  db.none('INSERT INTO simulations(application_state, expected_result, valid_result, comments)' +
      'values(${application_state}, ${expected_result}, ${valid_result}, ${comments})',
      req.body)
      .then(function () {
        res.status(200)
            .json({
              status: 'success',
              message: 'Inserted one simulation'
            });
      })
      .catch(function (err) {
        return next(err);
      });
}

module.exports = {
  getAllSimulations: getAllSimulations,
  getSimulation: getSimulation,
  createSimulation: createSimulation
};
