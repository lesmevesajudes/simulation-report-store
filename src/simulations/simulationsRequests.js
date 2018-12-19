import {isValidToken} from '../authentication/authService';
import config from '../config';
import database from '../database';
import {getTokenFromRequest, hasAll} from '../shared/common';
import Responses from '../shared/responses';

const db = database(config.DATABASE_CONNECTION_STRING);

export function getSimulation(req, res, next) {
  if (isValidToken(getTokenFromRequest(req))) {
    db.one('SELECT * FROM simulations WHERE id = $1', req.params.id)
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

export function getAllSimulations(req, res, next) {
  if (isValidToken(getTokenFromRequest(req))) {
    const range = req.query.range;
    const regexp = /\[(\d+), *(\d+)\]/g;
    const result = regexp.exec(range);
    if (result === null) return next(Responses.badRequest());
    const [, from, to] = result;
    db.one('SELECT COUNT(*) FROM simulations').then(function (countResult) {
      db.any('SELECT * FROM simulations ORDER BY id LIMIT $1 OFFSET $2', [to - from, from])
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
    return next(Responses.unauthorized());
  }
}

export function createSimulation(req, res, next) {
  if (!hasAll(req.body, ['simulation', 'id'])) {
    return next(Responses.badRequest());
  }
  db.none('INSERT INTO simulations (simulation, id) VALUES (${simulation}, ${id})',
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
