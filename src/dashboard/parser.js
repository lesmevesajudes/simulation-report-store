import Dashboard from '../model/DashboardCollection';
import {
	compose,
	filter,
	head,
	isEmpty,
    keys,
    map,
    not,
    path,
    pickAll,
    pickBy,
    pipe,
    pluck,
    prop,
    or,
    values} from 'ramda';

export const parse = (data,ajudes) => {
	if (data.result.persones == null) {
		return null;
	}
	const dashboard = new Dashboard({ 
		id_simulacio: data.id_simulacio
	});
	if (data.id_parent != null) {
		dashboard.id_parent = data.id_parent;
	}
	const dateMark = getDateMark(data.result);
	dashboard.data = dateMark;
	dashboard.persones = getResumPersones(data.result.persones, dateMark, ajudes);
	dashboard.habitatge = getResumHabitatge(data, dateMark, ajudes);
	dashboard.estatus = getEstatus(dashboard);
	return dashboard;
}

const getDateMark = result => {
	// { result: { persones: {'804d0876-ec94-42ab-953a-62a435a8a062': { AE_230_01_mensual: {'2017-01': 0 }}}, unitats_de_convivencia: {}}}--> '2017-01'
	const date = pipe(values,head,prop('edat'),keys,head)(result.persones)
	return date
}

const getResumPersones = (persones, dateMark, ajudesCodes) => {
	return compose(map(p => getResumPersona(p,dateMark, ajudesCodes)),
					values)(persones)
}
	
const getResumPersona = (persona, dateMark, ajudesCodes) => {
	const resumPersona = {};
	persona = pluck(dateMark, persona)
	const ajudes = compose(keys,
							pickBy(value => value > 0),
							pickAll(ajudesCodes))(persona);
	resumPersona.ajudes = ajudes;
	resumPersona.sexe = persona.sexe;
	resumPersona.edat = parseInt(persona.edat);
	resumPersona.discapacitat = persona.grau_discapacitat ? true : false;
	resumPersona.violencia = persona.victima_violencia_de_genere || persona.victima_violencia_domestica ? true : false;
	resumPersona.escolaritzacio = persona.es_escolaritzat_entre_P3_i_4rt_ESO ? true : false;
//	resumPersona.ingressos
	resumPersona.situacio_laboral = persona.situacio_laboral;
	return resumPersona;
}

const getResumHabitatge = (data, dateMark, ajudesCodes) => {
	const resumHabitatge = {};
	const ajudes = compose(
			keys,
			pickBy(value => value > 0),
			pluck(dateMark),
			pickAll(ajudesCodes),
			head,
			values)(data.result.unitats_de_convivencia);
	resumHabitatge.ajudes = ajudes;
	if (data.simulation.residence) {
		resumHabitatge.relacio_habitatge = data.simulation.residence.relacio_habitatge;
	}
	return resumHabitatge;
}

export const getEstatus = dashboard => {
	const areAjudesPersones = compose(not,
									isEmpty,
									filter(pipe(isEmpty,not)),
									map(prop('ajudes')),
									prop('persones'))(dashboard)

	const areAjudesHabitatge = compose(not,
									isEmpty,
									filter(pipe(isEmpty,not)), // r => !isEmpty(r))
									path(['habitatge','ajudes']))(dashboard)
	return or(areAjudesPersones,areAjudesHabitatge)
}