import {parse} from '../dashboard/parser';
import {getSimulations} from '../simulations/simulationsRequests'
import Simulation from '../model/SimulationCollection';
import Dashboard from '../model/DashboardCollection';
import {compose, map} from 'ramda';

const ajudesKeys = [
	'AE_230_01_mensual',
	'AE_230_mensual',
	'EG_233_mensual',
	'GA_234_01',
	'GA_234_02',
	'GA_246_01',
	'GA_246_02',
	'GE_051_00_mensual',
	'GE_051_01_mensual',
	'GE_051_02_mensual',
	'GE_051_03_mensual',
	'GG_270_mensual',
	'HA_001',
	'HA_002',
	'HA_003',
	'HA_004',
	'HA_004_01',
	'HA_005']

const fs = require('fs');

const saveDashboard = data => {
	const dashboard = new Dashboard(data);
	dashboard.save((error, dashboard) => {
		  if (error) {
			  console.log('create dashboard error ');
			  console.log(error);
		  }
		  console.log(data)
		  console.log('dashboard created')
	  });
}

export const generateResumes = () => {
	Simulation.find({result: {$ne:null}, result: {$ne: 'error'}, simulation: {$ne:null}})
	.lean(true)
	.then(function (data) {
		compose(map(s => saveDashboard(s)),
				map(s => parse(s, ajudesKeys)))(data)
	}).catch(function (err) {
        console.log('getSimulations error');
        console.log(err);
	});
}