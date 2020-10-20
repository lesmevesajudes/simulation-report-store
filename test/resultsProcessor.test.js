import {getDateMark, extractPersones, extractUnitatsDeConvivencia, extractResults} from '../src/simulations/resultsProcessor';

const persona1 = {
	'804d0876-ec94-42ab-953a-62a435a8a060': {
	    AE_230_01_mensual: {
	        '2017-01': 0
	    },
	    AE_230_mensual: {
	        '2017-01': 0
	    },
	    GG_270_mensual: {
	        '2017-01': 1
	    },
	    anys_empadronat_a_barcelona: {
	        '2017-01': '20'
	    },
	    beneficiari_de_prestacio_residencial: {
	        '2017-01': false
	    },
	    edat: {
	        '2017-01': '39'
	    },
	    en_acolliment: {
	        '2017-01': false
	    }
	}
};

const persona2 = {
	'804d0876-ec94-42ab-953a-62a435a8a062': {
        AE_230_01_mensual: {
            '2017-01': 0
        },
        AE_230_mensual: {
            '2017-01': 1
        },
        GG_270_mensual: {
            '2017-01': 100
        }
	}
};

const unitatConvivencia1 = {
	'804d0876-ec94-42ab-953a-62a435a8a061' : {
		HA_002: {
            '2017-01': 0
        },
        HA_003: {
            '2017-01': 0
        },
        HA_004: {
            '2017-01': 1
        },
        codi_postal_habitatge: {
            '2017-01': '08032'
        },
        demarcacio_de_lhabitatge: {
            '2017-01': 'barcelona_ciutat'
        },
        existeix_deute_en_el_pagament_de_la_hipoteca: {},
        existeix_deute_en_el_pagament_del_lloguer: {
            '2017-01': false
        }
	}
}

const unitatConvivencia2 = {
	'804d0876-ec94-42ab-953a-62a435a8a063' : {
		HA_002: {
            '2017-01': 0
        },
        HA_003: {
            '2017-01': 1
        },
        HA_004: {
            '2017-01': 100
        }
	}	
}

const result1 = { 
		persones: { },
		unitats_de_convivencia: { }
};
result1.persones = persona1;
result1.unitats_de_convivencia = unitatConvivencia1;

const result2 = { 
		persones: { persona2 },
		unitats_de_convivencia: { unitatConvivencia2 }
};
result2.persones = persona2;
result2.unitats_de_convivencia = unitatConvivencia2;

const results = [
	{result : {}},
	{result : {}}
];
results[0].result = result1;
results[1].result = result2;


describe('getDateMark1', () => {
	it('should return a date mark', async () => {
		const dateMark = getDateMark([result1,result2]);
		expect(dateMark).toBe('2017-01');
	});
});

describe('extractPersons', () => {
	it('should return a list a persones with ajudes', async () => {
		const personesResult = extractPersones([result1, result2]);
		const personesExpected = [
			{
				AE_230_01_mensual: 0,
				AE_230_mensual: 0,
				GG_270_mensual: 1,
                anys_empadronat_a_barcelona: '20',
                beneficiari_de_prestacio_residencial: false,
                edat: '39',
                en_acolliment: false
			},{
				AE_230_01_mensual: 0,
				AE_230_mensual: 1,
				GG_270_mensual: 100
			}
		];
		expect(JSON.stringify(personesResult)).toBe(JSON.stringify(personesExpected));
	});
});

describe('extractUnitatsDeConvivencia', () => {
	it('should return a list a unitats de convivencia with ajudes', async () => {
		const unitatsDeConvivenciaResult = extractUnitatsDeConvivencia([result1, result2]);
		const unitatsDeConvivenciaExpected = [
			{
				HA_002: 0,
				HA_003: 0,
				HA_004: 1,
                codi_postal_habitatge: '08032',
                demarcacio_de_lhabitatge:'barcelona_ciutat',
                existeix_deute_en_el_pagament_del_lloguer: false
			},{
				HA_002: 0,
				HA_003: 1,
				HA_004: 100
			}
		];
		expect(JSON.stringify(unitatsDeConvivenciaResult)).toBe(JSON.stringify(unitatsDeConvivenciaExpected));
	});
});

describe('extractResults', () => {
	it('should return a resume of agregated results', async () => {
		const results = [
			{result : {}},
			{result : {}}
		];
		results[0].result = result1;
		results[1].result = result2;
		
		const aggregatedResults = extractResults(results);
		const extractResultsExpected = {
				AE_230_01_mensual: 0,
				AE_230_mensual: 1,
				EG_233_mensual: 0,
				GA_234_01: 0,
				GA_234_02: 0,
				GA_246_01: 0,
				GA_246_02: 0,
				GE_051_00_mensual: 0,
				GE_051_01_mensual: 0,
				GE_051_02_mensual: 0,
				GE_051_03_mensual: 0,
				GG_270_mensual: 2,
				HA_002: 0,
				HA_003: 1,
				HA_004: 2,
				HA_004_01: 0,
				HA_005: 0,
				positives:0,
				negatives:0,
				error:0
			};
		
//		const extractResultsExpected = {
//				AE_230_01_mensual: {
//					count: 34,
//					sex: {homes:30,dones:70},
//					age: {menors:20,adults:50,jubilats:30},
//					disabled: {yes:80,no:20},
//					violence: {yes:80,no:20},
//					school: {yes:80,no:20},
//				},
//				AE_230_mensual: 1,
//				EG_233_mensual: 0,
//				GA_234_01: 0,
//				GA_234_02: 0,
//				GA_246_01: 0,
//				GA_246_02: 0,
//				GE_051_00_mensual: 0,
//				GE_051_01_mensual: 0,
//				GE_051_02_mensual: 0,
//				GE_051_03_mensual: 0,
//				GG_270_mensual: 2,
//				HA_002: 0,
//				HA_003: 1,
//				HA_004: 2,
//				HA_004_01: 0,
//				HA_005: 0,
//				positives:0,
//				negatives:0,
//				error:0
//			};
		expect(JSON.stringify(aggregatedResults)).toBe(JSON.stringify(extractResultsExpected));
	});
});





