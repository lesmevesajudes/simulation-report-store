import {isValidToken} from '../authentication/authService';
import config from '../config';
import {database,connect} from '../database';
import Simulation from '../model/SimulationCollection';
import {getTokenFromRequest, hasAll} from '../shared/common';
import Responses from '../shared/responses';
import {extractResults} from './resultsProcessor.js';
import {generateResumes} from '../tools/generate_simulation_resums.js'

//const db = database(config.DATABASE_CONNECTION_STRING);
const db = connect('mongodb://jamgo:jamgo@localhost:27017/les-meves-ajudes');

//generateResumes();


//Simulation.find(function(error, simulations) {
//	if (error){
//		console.log(error);
//	} else {
//		console.log('Simulations ' + simulations.length);
//		console.log(simulations[0].id);
//		console.log(simulations[0].simulation);
//		console.log(simulations[0].result);
//	}
//});

	
export function getSimulation(req, res, next) {
  console.log('getSimulation ' + JSON.stringify(req.params.id));
  if (isValidToken(getTokenFromRequest(req))) {
	  Simulation.where({id: req.params.id}).findOne().then(data => {
//		  console.log(new Date(simulation.created_at) + " - " + new Date().setFullYear(new Date().getFullYear() - 1));
		  console.log(data);
		  if (new Date(data.created_at) >  new Date().setFullYear(new Date().getFullYear() - 1)) {
			  console.log('simulation ok');
			  res.status(200).json(data);
		  } else {
			  res.status(210).json(data);
		  }
	  }).catch(function (err) {
        console.log('getSimulation error ' + JSON.stringify(req.body));
        return next(err);
      });;
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
            console.log('getAllSimulations error');
            return next(err);
          });
    });
  } else {
    return next(Responses.unauthorized());
  }
}

/*export function getAllSimulations(req, res, next) {
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
}*/

export function getAllResults(req, res, next) {
	console.log('getAllResults');
		if (isValidToken(getTokenFromRequest(req))) {
//			const { page = 1, limit = 100 } = req.body;
			Simulation.find({result: {$ne:null}, result: {$ne: 'error'} },{result: {persones:1, unitats_de_convivencia:1}, _id: 0})
//				.limit(limit)
//				.skip((page-1)*limit)
				.lean(true)
				.then(function (data) {
					const results = extractResults(data);
					res.status(200).json({
						'results': results,
//						'page': page
					});
				}).catch(function (err) {
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
		  const initial_simulation_id = req.body.simulation.initial_simulation_id ? req.body.simulation.initial_simulation_id : null;
		  const simulation = new Simulation({ 
			  							id: shortid.generate(),
			  							simulation: req.body.simulation.data,
			  							result: req.body.simulation.result,
			  							created_at: new Date(),
			  							id_parent: initial_simulation_id
			  					});
		  simulation.save((error, simulation) => {
			  if (error) {
				  console.log('createSimulation error ' + id + ' ' +  + JSON.stringify(req.body));
				  return next(error);
			  }
			  
			  res.status(200)
				  .json({
					  status: 'success',
					  message: 'Inserted one simulation',
					  id: simulation.id
				  });
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
	
	const simulation = req.body.simulation;
	console.log(simulation.created_at);
	console.log(simulation.initial_simulation_id);
	Simulation.where({ id: simulation.id })
			.setOptions({ overwrite: true })
			.replaceOne({ id: simulation.id, result: simulation.result, simulation: simulation.data, created_at: simulation.created_at, id_parent: simulation.initial_simulation_id }, (error, count) => {
				if (error) {
					console.log('updateSimulation error ' + JSON.stringify(req.body));
					return next(error);
				}
				res.status(200)
		            .json({
		              status: 'success',
		              message: 'Updated simulation with id ' + req.body.simulation.id
		            });
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


