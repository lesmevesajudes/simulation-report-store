import {isValidToken} from '../authentication/authService';
import config from '../config';
import database from '../database';
import Responses from '../shared/responses';
import {getTokenFromRequest, hasAll} from '../shared/common';

const db = database(config.DATABASE_CONNECTION_STRING);

export function getAllSimulationReports(req, res, next) {
	console.log('getAllSimulationReports');
  if (isValidToken(getTokenFromRequest(req))) {
    const range = req.query.range;
    const regexp = /\[(\d+), *(\d+)\]/g;
    const result = regexp.exec(range);
    if (result === null) return next(Responses.badRequest());
    const [, from, to] = result;
    db.one('SELECT COUNT(*) FROM simulation_reports').then(function (countResult) {
      db.any('SELECT * FROM simulation_reports ORDER BY id LIMIT $1 OFFSET $2', [to - from, from])
          .then(function (data) {
            res.set('Content-Range', 'simulation_reports ' + from + '-' + to + '/' + countResult.count);
            res.status(200)
                .json(data);
          })
          .catch(function (err) {
            return next(err);
          });
    });
  } else {
    return next(Responses.unauthorized());
  }
}

export function getSimulationReport(req, res, next) {
	console.log('getSimulationReport');
	console.log(req.params.id);
  if (isValidToken(getTokenFromRequest(req))) {
	console.log(req.params.id);
    db.one('SELECT * FROM simulation_reports WHERE id = $1', req.params.id)
        .then(function (data) {
          res.status(200)
              .json(data);
        })
        .catch(function (err) {
          return next(err);
        });
  } else {
    return next(Responses.unauthorized());
  }
}

export function createSimulationReport(req, res, next) {
  if (!hasAll(req.body, ['application_state', 'simulation_id', 'expected_result', 'accepted_result', 'comments', 'reporter_email', 'test_group'])) {
    return next(Responses.badRequest());
  }
  db.none('INSERT INTO simulation_reports (application_state, simulation_id, expected_result, accepted_result, comments, reporter_email, test_group) VALUES (${application_state}, ${simulation_id},${expected_result}, ${accepted_result}, ${comments}, ${reporter_email}, ${test_group})',
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
