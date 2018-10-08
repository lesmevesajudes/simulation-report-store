import promise from 'bluebird';
import config from '../config.js';
import {badRequest, unauthorized} from './responses';
import {hasAll} from "../common";

const options = {
  // Initialization Options
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = config.DATABASE_CONNECTION_STRING;
const db = pgp(connectionString);


function authenticate(req, token) {
  const clientToken = req.get('Authentication-Token');
  return clientToken === token;
}

export function getAllSimulationReports(req, res, next) {
  if (authenticate(req, config.AUTH_TOKEN)) {
    const range = req.query.range;
    const regexp = /\[(\d+), *(\d+)\]/g;
    const result = regexp.exec(range);
    if (result === null) return next(badRequest());
    const [, from, to] = result;
    db.one('SELECT COUNT(*) FROM simulation_reports').then(function (countResult) {
      db.any('SELECT * FROM simulation_reports LIMIT $1 OFFSET $2', [to - from, from])
          .then(function (data) {
            res.set('Content-Range', 'simulations ' + from + '-' + to + '/' + countResult.count);
            res.status(200)
                .json(data);
          })
          .catch(function (err) {
            return next(err);
          });
    });
  } else {
    return next(unauthorized());
  }

}

export function getSimulationReport(req, res, next) {
  if (authenticate(req, config.AUTH_TOKEN)) {
    db.one('SELECT * FROM simulation_reports WHERE id = $1', req.params.id)
        .then(function (data) {
          res.status(200)
              .json(data);
        })
        .catch(function (err) {
          return next(err);
        });
  } else {
    return next(unauthorized());
  }
}

export function createSimulationReport(req, res, next) {
  if (!hasAll(req.body, ['application_state', 'simulation_id', 'expected_result', 'accepted_result', 'comments', 'tester_email', 'test_group'])) {
    return next(badRequest());
  }
  db.none('INSERT INTO simulation_reports (application_state, simulation_id, expected_result, accepted_result, comments, tester_email, test_group) VALUES (${application_state}, ${simulation_id},${expected_result}, ${accepted_result}, ${comments}, ${tester_email}, ${test_group})',
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
