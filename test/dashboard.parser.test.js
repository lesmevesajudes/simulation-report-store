import {parse} from '../src/dashboard/parser';
import {simulation} from './data/simulation.js';

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

describe('parse', () => {
	it('should return a dashboard resume', async () => {
		const dashboardData = parse(simulation, ajudesKeys);
		console.log(dashboardData)
		expect(dashboardData.id_simulacio).toBe('DR4pbzwtB');
		expect((1900 + dashboardData.data.getYear()) + "-" + (dashboardData.data.getMonth() + 1)).toBe('2020-10');
		
		expect(dashboardData.persones.length).toBe(2);
		
		const persona1 = dashboardData.persones[0];
		expect(persona1.ajudes.length).toBe(2);
		expect(persona1.ajudes[0]).toBe('GA_246_01');
		expect(persona1.ajudes[1]).toBe('GE_051_02_mensual');
		expect(persona1.sexe).toBe('dona');
		expect(persona1.edat).toBe('87');
		expect(persona1.discapacitat).toBe(true);
		expect(persona1.violencia).toBe(true);
		expect(persona1.escolaritzacio).toBe(false);
		expect(persona1.situacio_laboral).toBe('jubilat');
		
		const persona2 = dashboardData.persones[1];
		expect(persona2.ajudes.length).toBe(0);
		expect(persona2.sexe).toBe('home');
		expect(persona2.edat).toBe('25');
		expect(persona2.discapacitat).toBe(false);
		expect(persona2.violencia).toBe(false);
		
		expect(dashboardData.habitatge.ajudes.length).toBe(2);
		expect(dashboardData.habitatge.ajudes[0]).toBe('HA_001');
		expect(dashboardData.habitatge.ajudes[1]).toBe('HA_003');
		expect(dashboardData.habitatge.relacio_habitatge).toBe('altres');
	});
});





