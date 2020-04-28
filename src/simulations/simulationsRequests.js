import {isValidToken} from '../authentication/authService';
import config from '../config';
import database from '../database';
import {getTokenFromRequest, hasAll} from '../shared/common';
import Responses from '../shared/responses';

const db = database(config.DATABASE_CONNECTION_STRING);

export function getSimulation(req, res, next) {
  console.info('getSimulation');
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
	console.info('getAllSimulations');
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
  console.log('createSimulation ' + req.body.simulation + ' ' + req.body.id);
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

export function updateSimulation(req, res, next) {
	  console.log('updateSimulation ' + req.body.simulation + ' ' + req.body.id);
	  if (!hasAll(req.body, ['simulation', 'id'])) {
	    return next(Responses.badRequest());
	  }
	  db.none('UPDATE simulations SET simulation = ${simulation} WHERE id = ${id}',
	      req.body)
	      .then(function () {
	        res.status(200)
	            .json({
	              status: 'success',
	              message: 'Updated simulation with id ' + req.body.id
	            });
	      })
	      .catch(function (err) {
	        return next(err);
	      });
	}

export function showAllSimulations(req, res, next) {
	db.one('SELECT * FROM simulations WHERE id = $1', '78c57f1b-a7fa-4faf-8efc-a40791c7bff4')
    .then(function (data) {
    	data = JSON.parse(JSON.stringify(data));
    	var id = data.id;
    	console.log(id);
    	var simulation = JSON.parse(data.simulation);
    	var families = simulation.families;
    	var persones = simulation.persones;
    	var unitatsDeConvivencia = simulation.unitats_de_convivencia;
    	var familiesFinsSegonGrau = simulation.families_fins_a_segon_grau;
    	console.log(families);
    	console.log(persones);
    	console.log(persones[Object.keys(persones)[0]]);
    	console.log(persones[Object.keys(persones)[0]].anys_empadronat_a_barcelona);
    	console.log(unitatsDeConvivencia);
    	console.log(unitatsDeConvivencia[Object.keys(unitatsDeConvivencia)[0]]);
    	console.log(familiesFinsSegonGrau);
    	
    	res.render('index', { title: 'Hey', id, families, persones, unitatsDeConvivencia, unitatsDeConvivencia, familiesFinsSegonGrau});
    })
    .catch(function (err) {
      return next(err);
    });
}
