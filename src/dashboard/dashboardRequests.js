import {isValidToken} from '../authentication/authService';
import config from '../config';
import {connect} from '../database';
import Dashboard from '../model/DashboardCollection';
import {getTokenFromRequest} from '../shared/common';
import Responses from '../shared/responses';
import {generateResumes} from '../tools/generate_simulation_resums.js'

//const db = database(config.DATABASE_CONNECTION_STRING);
connect('mongodb://jamgo:jamgo@localhost:27017/les-meves-ajudes');

//generateResumes();

export function getAll(req, res, next) {
	console.log('get all dashboard');
		if (isValidToken(getTokenFromRequest(req))) {
//			Dashboard.find({result: {$ne:null}, result: {$ne: 'error'} },{result: {persones:1, unitats_de_convivencia:1}, _id: 0})
//			Dashboard.find({id_simulacio : {$ne: null}})
			Dashboard.find()
				.lean(true)
				.then(function (data) {
					res.status(200).json({
						'dashboards': data,
					});
				}).catch(function (err) {
			        console.log('get all dashboard error');
			        return next(err);
				});
	  } else {
	    return next(Responses.unauthorized());
	  }
}

export function countEditedSimulations(req, res, next) {
	console.log('get all edited simulations dashboard');
		if (isValidToken(getTokenFromRequest(req))) {
			Dashboard.count({ id_parent: {$ne: null}}).then(function (data) {
				res.status(200).json({
					'count': data,
				});
			}).catch(function (err) {
		        console.log('count edited simulations error');
		        return next(err);
			});
	  } else {
	    return next(Responses.unauthorized());
	  }
}