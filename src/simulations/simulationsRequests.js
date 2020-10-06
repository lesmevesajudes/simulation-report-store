import {isValidToken} from '../authentication/authService';
import config from '../config';
import database from '../database';
import {getTokenFromRequest, hasAll} from '../shared/common';
import Responses from '../shared/responses';

const db = database(config.DATABASE_CONNECTION_STRING);

export function getSimulation(req, res, next) {
  console.log('getSimulation ' + JSON.stringify(req.params.id));
  if (isValidToken(getTokenFromRequest(req))) {
//    db.one('SELECT * FROM simulations WHERE id = $1 and created_at between (now() - interval \'1 year\') and now()', req.params.id)
    db.one('SELECT * FROM simulations WHERE id = $1', req.params.id)
        .then(function (data) {
          console.log(new Date(data.created_at) + " - " + new Date().setFullYear(new Date().getFullYear() - 1));
          if (new Date(data.created_at) >  new Date().setFullYear(new Date().getFullYear() - 1)) {
    		res.status(200).json(data);
    	  } else {
    		res.status(210).json(data);
    	  }
        })
        .catch(function (err) {
          console.log('getSimulation error ' + JSON.stringify(req.body));
          return next(err);
        });
  } else {
    return next(Responses.unauthorized());
  }
}

/*export function getAllSimulations(req, res, next) {
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
            console.log('getAllSimulations error');
            return next(err);
          });
    });
  } else {
    return next(Responses.unauthorized());
  }
}*/

export function getAllSimulations(req, res, next) {
  if (isValidToken(getTokenFromRequest(req))) {
    db.any('SELECT * FROM simulations')
      .then(function (data) {
        res.status(200)
            .json(data);
      })
      .catch(function (err) {
        console.log('getAllSimulations error');
        return next(err);
    });
  } else {
    return next(Responses.unauthorized());
  }
}

export function getAllResults(req, res, next) {
	  if (isValidToken(getTokenFromRequest(req))) {
	    db.any('SELECT result FROM simulations')
	      .then(function (data) {
	        res.status(200)
	            .json(data);
	      })
	      .catch(function (err) {
	        console.log('getAllResults error');
	        return next(err);
	    });
	  } else {
	    return next(Responses.unauthorized());
	  }
	}

export function createSimulation(req, res, next) {
	console.log('createSimulation '  + JSON.stringify(req.body));
	  if (!hasAll(req.body, ['simulation'])) {
		  return next(Responses.badRequest());
	  }
	  if (!hasAll(req.body.simulation, ['data','result'])) {
		  return next(Responses.badRequest());
	  }
	  if (req.body.simulation.id) {
		  updateSimulation(req, res, next)
	  } else {
		  const shortid = require('shortid');
		  const id = shortid.generate();
		  console.log('generated shortid ' + id);
		  const initial_simulation_id = req.body.simulation.initial_simulation_id ? req.body.simulation.initial_simulation_id : null;
		  db.none('INSERT INTO simulations (id, id_parent, result, simulation) VALUES (\'' + id + '\',\'' + initial_simulation_id + '\',${simulation.result},${simulation.data})',
				  req.body)
				  .then(function () {
					  res.status(200)
					  .json({
						  status: 'success',
						  message: 'Inserted one simulation',
						  id: id
					  });
				  })
				  .catch(function (err) {
					  console.log('createSimulation error ' + id + ' ' +  + JSON.stringify(req.body));
					  return next(err);
				  });
	  }
	}

export function updateSimulation(req, res, next) {
	  console.log('updateSimulation ' +  JSON.stringify(req.body));
	  if (!hasAll(req.body, ['simulation'])) {
		  return next(Responses.badRequest());
	  }
	  if (!hasAll(req.body.simulation, ['id','data','result'])) {
		  return next(Responses.badRequest());
	  }
	  db.none('UPDATE simulations SET simulation = ${simulation.data}, result=${simulation.result} WHERE id = ${simulation.id}',
	      req.body)
	      .then(function () {
	        res.status(
	        		200)
	            .json({
	              status: 'success',
	              message: 'Updated simulation with id ' + req.body.simulation.id
	            });
	      })
	      .catch(function (err) {
			console.log('updateSimulation error ' + JSON.stringify(req.body));
	        return next(err);
	      });
	}

//export function showAllSimulations(req, res, next) {
//	db.one('SELECT * FROM simulations WHERE id = $1', '78c57f1b-a7fa-4faf-8efc-a40791c7bff4')
//    .then(function (data) {
//    	data = JSON.parse(JSON.stringify(data));
//    	var id = data.id;
//    	console.log(id);
//    	var simulation = JSON.parse(data.simulation);
//    	var families = simulation.families;
//    	var persones = simulation.persones;
//    	var unitatsDeConvivencia = simulation.unitats_de_convivencia;
//    	var familiesFinsSegonGrau = simulation.families_fins_a_segon_grau;
//    	console.log(families);
//    	console.log(persones);
//    	console.log(persones[Object.keys(persones)[0]]);
//    	console.log(persones[Object.keys(persones)[0]].anys_empadronat_a_barcelona);
//    	console.log(unitatsDeConvivencia);
//    	console.log(unitatsDeConvivencia[Object.keys(unitatsDeConvivencia)[0]]);
//    	console.log(familiesFinsSegonGrau);
//
//    	res.render('index', { title: 'Hey', id, families, persones, unitatsDeConvivencia, unitatsDeConvivencia, familiesFinsSegonGrau});
//    })
//    .catch(function (err) {
//      return next(err);
//    });
//}
