import {isValidToken} from '../authentication/authService';
import config from '../config';
import {database, connect} from '../database';
import Responses from '../shared/responses';
import {getTokenFromRequest, hasAll} from '../shared/common';
import SimulationReport from '../model/SimulationReportCollection';

// const db = database(config.DATABASE_CONNECTION_STRING);

const db = connect('mongodb://jamgo:jamgo@localhost:27017/les-meves-ajudes');

export function getAllSimulationReports(req, res, next) {
	console.log('getAllSimulationReports');
	if (!isValidToken(getTokenFromRequest(req))) {
		return next(Responses.unauthorized());
	}
    // const range = req.query.range;
    // const regexp = /\[(\d+), *(\d+)\]/g;
    // const result = regexp.exec(range);
    // if (result === null) {
    // return next(Responses.badRequest());
    // }
    
    // TODO include sort parameter in query
	var { page = 1, limit = 100 } = req.query;
	limit = parseInt(limit);
	page = parseInt(page);
	SimulationReport.find()
					.limit(limit)
					.skip((page-1)*limit)
					.lean(true)
					.then(function (data) {
						console.log("all reports -" + data);
						const results = data;
						res.status(200).json({
							'results': results,
							'page': page
						});
					}).catch(function (err) {
				        console.log('getAllSimulationReports error');
				        return next(err);
					});
}

export function getSimulationReport(req, res, next) {
	console.log('getSimulationReport');
	if (!isValidToken(getTokenFromRequest(req))) {
		return next(Responses.unauthorized());
	}
	SimulationReport.findById(req.params.id).then(data => {
		res.status(210).json(data);
	}).catch(function (err) {
		console.log('getSimulationReport error ' + JSON.stringify(req.body));
		return next(err);
	});
	
}

export function createSimulationReport(req, res, next) {
	if (!hasAll(req.body, ['application_state', 'simulation_id', 'expected_result', 'accepted_result', 'comments', 'reporter_email', 'test_group'])) {
		return next(Responses.badRequest());
	}
	
	console.log(req.body);
	const simulation_report = new SimulationReport(req.body);
	simulation_report.save((error, simulation_report) => {
		if (error) {
			console.log('createSimulationReport error ' + JSON.stringify(req.body));
			return next(error);
		}
	
		res.status(200).json({
			status: 'success',
			message: 'Inserted one simulation report',
			id: simulation_report.id
		});
	});
}
