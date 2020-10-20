import {any,
        chain,
        compose,
        concat,
        filter,
        groupBy,
        head,
        isEmpty,
        isNil,
        keys,
        map,
        or,
        pickAll,
        pipe,
        pluck,
        reduce,
        toPairs,
        values} from 'ramda';
        
const ajudesPersonalsKeys = ['AE_230_01_mensual',
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
            					'GG_270_mensual']
const ajudesConvivenciaKeys = ['HA_002',
								'HA_003',
								'HA_004',
								'HA_004_01',
								'HA_005']
const personaProperties = ['edat',
							'grau_discapacitat',
							'sexe',
							'situacio_laboral',
							'victima_violencia_de_genere',
							'victima_violencia_domestica',
							'es_escolaritzat_entre_P3_i_4rt_ESO']
        
const getValue = (key, object) => object ? object[key] : ''
//const getValue = object => object ? object[head(keys(object))] : '' // {"1c61e969-bbe2-49e2-a950-0e99f22786f1": {"HA_001": {...}}, "HA_002": {...}}} -> {"HA_001": {...}, "HA_002": {...}}
const greaterThanZero = v => v > 0
const parsePositive = v => v > 0 ? 1 : 0
		
export const getDateMark = (data) => {
	// [{ result: { persones: {'804d0876-ec94-42ab-953a-62a435a8a062': { AE_230_01_mensual: {'2017-01': 0 }}}, unitats_de_convivencia: {}}}, {result: {}}]--> '2017-01'
	return pipe(values,head,values,head,keys,head)(head(data).persones);
}
		
export const extractPersones = (data) => {
	const simulationDateMark = getDateMark(data);
	
	const personesList = map(r => r.persones)(data)
	const personesValuesList = map(v => {
		// reduce persona helps to a single result
		const vs = pipe(chain(toPairs), groupBy(head), map(pluck(1)))(values(v))
		return map(i => reduce(or,0,pluck(simulationDateMark, i)),vs)
	})(personesList)
	return personesValuesList
}

export const extractUnitatsDeConvivencia = (data) => {
	const simulationDateMark = getDateMark(data);
	
	const unitatsDeConvivenciaList = map(r => r.unitats_de_convivencia)(data)
	const filteredUnitatsDeConvivenciaList = filter(uc => !isNil(uc) && !isEmpty(uc))(unitatsDeConvivenciaList)
	//const unitatsDeConvivenciaValuesList = map(v => getValue(head(keys(v)),v))(filteredUnitatsDeConvivenciaList)
	const unitatsDeConvivenciaValuesList = map(uc => {
		// get child value nodes from unitat de convivencia parent node
		// {"1c61e969-bbe2-49e2-a950-0e99f22786f1": {"HA_001": {"2020-03":1},"HA_002": {"2020-03":1}}} -> {"HA_001": {"2020-03":1},"HA_002": {"2020-03":1}}
		const v = getValue(head(keys(uc)),uc)
		// remove date from values
		// {"HA_001": {"2020-03":1},"HA_002": {"2020-03":1}} -> {"HA_001": 1,"HA_002": :1}
		return pluck(simulationDateMark)(v)
	})(filteredUnitatsDeConvivenciaList)
	return unitatsDeConvivenciaValuesList
}

export const extractResults = (data) => {
	const errors = [];
	const results = compose(
						filter(r => !isEmpty(r) && !isNil(r)),
						map(s => s.result))(data)
	
	const ajudesPersona = compose(map(pickAll(ajudesPersonalsKeys)),
								extractPersones)(results)
	const ajudesConvivencia = compose(map(pickAll(ajudesConvivenciaKeys)),
									extractUnitatsDeConvivencia)(results)
	const ajudes = concat(ajudesPersona, ajudesConvivencia)
	const ajudesValues = map(map(parsePositive))(ajudes)
	const ajudesPositives = filter(a => any(greaterThanZero, values(a)))(ajudesValues)
	const groupedAjudes = pipe(chain(toPairs), groupBy(head), map(pluck(1)))(ajudesPositives)
	const result = map(a => reduce((a,b) => a + b,0,a))(groupedAjudes)
	// TODO añadir los a cada simulación un nuevo atributos que marque si ha sido positiva/negativa/error y aqui meter el count
	result.positives = 0;
	result.negatives = 0;
	result.error = 0;
	return result
	
	//TODO pending sort
	//const pairs =toPairs(result)
	//sortedResult = reverse(sortBy(a => head(values(a)))(result))
}