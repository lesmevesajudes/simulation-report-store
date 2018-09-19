var promise = require('bluebird');
var config = require('../config.js');
var responses = require('./responses');

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

function getAllSimulations(req, res, next) {
  if (authenticate(req, config.AUTH_TOKEN)) {
    var range = req.query.range;
    var regexp = /\[(\d+), *(\d+)\]/g;
    var result = regexp.exec(range);
    if ( result === null ) return next(responses.badRequest());
    var from = result[1];
    var to = result[2];
    db.one('SELECT COUNT(*) FROM simulations').then(function (countResult) {
      db.any('SELECT * FROM simulations LIMIT ' + (to - from) + ' OFFSET ' + from)
          .then(function (data) {
            res.set('Content-Range', 'simulations '+from + '-' + to + '/' + countResult.count);
            res.status(200)
                .json(data);
          })
          .catch(function (err) {
            return next(err);
          });
    });
  } else {
    return next(responses.unauthorized());
  }

}

function getSimulation(req, res, next) {
  if (authenticate(req, config.AUTH_TOKEN)) {
    db.one('SELECT * FROM simulations WHERE id = $1', req.params.id)
        .then(function (data) {
          res.status(200)
              .json(data);
        })
        .catch(function (err) {
          return next(err);
        });
  } else {
    return next(responses.unauthorized());
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
