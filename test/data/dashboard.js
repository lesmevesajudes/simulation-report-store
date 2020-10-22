export const dashboard_with_ajudes_persona_and_habitatge = { 
	      id_simulacio: 'DR4pbzwtB',
	      persones:
	       [ { ajudes: ['GA_200', 'GA_201'],
	           sexe: 'dona',
	           edat: 87,
	           discapacitat: true,
	           violencia: true,
	           escolaritzacio: false,
	           situacio_laboral: 'jubilat' },
	         { ajudes: ['GA_200'],
	           sexe: 'home',
	           edat: 25,
	           discapacitat: false,
	           violencia: false,
	           escolaritzacio: false,
	           situacio_laboral: 'aturat' } ],
	      habitatge:
	       { ajudes: [ 'HA_001', 'HA_003' ], relacio_habitatge: 'altres' } 
}

export const dashboard_with_ajudes_persona = {
	      id_simulacio: 'DR4pbzwtB',
	      persones:
	       [ { ajudes: [],
	           sexe: 'dona',
	           edat: 87,
	           discapacitat: true,
	           violencia: true,
	           escolaritzacio: false,
	           situacio_laboral: 'jubilat' },
	         { ajudes: ['GA_200', 'GA_201'],
	           sexe: 'home',
	           edat: 25,
	           discapacitat: false,
	           violencia: false,
	           escolaritzacio: false,
	           situacio_laboral: 'aturat' } ],
	      habitatge:
	       { ajudes: [ ], relacio_habitatge: 'altres' } 
}

export const dashboard_with_ajudes_habitatge = {
	      id_simulacio: 'DR4pbzwtB',
	      persones:
	       [ { ajudes: [],
	           sexe: 'dona',
	           edat: 87,
	           discapacitat: true,
	           violencia: true,
	           escolaritzacio: false,
	           situacio_laboral: 'jubilat' },
	         { ajudes: [],
	           sexe: 'home',
	           edat: 25,
	           discapacitat: false,
	           violencia: false,
	           escolaritzacio: false,
	           situacio_laboral: 'aturat' } ],
	      habitatge:
	       { ajudes: [ 'HA_001' ], relacio_habitatge: 'altres' } 
}

export const dashboard_without_ajudes = {
	      id_simulacio: 'DR4pbzwtB',
	      persones:
	       [ { ajudes: [],
	           sexe: 'dona',
	           edat: 87,
	           discapacitat: true,
	           violencia: true,
	           escolaritzacio: false,
	           situacio_laboral: 'jubilat' },
	         { ajudes: [],
	           sexe: 'home',
	           edat: 25,
	           discapacitat: false,
	           violencia: false,
	           escolaritzacio: false,
	           situacio_laboral: 'aturat' } ],
	      habitatge:
	       { ajudes: [ ], relacio_habitatge: 'altres' } 
}
