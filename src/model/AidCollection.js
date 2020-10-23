    	
const mongoose = require('mongoose');

const aidSchema = new mongoose.Schema({
	codi: String,
	descripcio: Object,
	data_inici: Date,
	data_fi: Date,
});

const Aid = mongoose.model('Aid', aidSchema,'aids');

export default Aid;